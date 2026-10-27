import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { forkJoin, of, Subject } from 'rxjs';
import { catchError, debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import {
  Food,
  FoodAttribute,
  FoodCategory,
  FoodClassification,
} from '../../core/models/food.model';
import {
  AttributeComparisonOperator,
  COMPARISON_OPERATORS,
  ComparisonOperatorOption,
  FoodAttributeFilter,
  FoodSearchRequest,
} from '../../core/models/food-search.model';
import { FoodApiService } from '../../core/services/food-api.service';
import { ClassificationService } from 'src/app/core/services/classification.service';
import { AttributeService } from 'src/app/core/services/attribute.service';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-food-search',
  templateUrl: './food-search.component.html',
  styleUrls: ['./food-search.component.css'],
})
export class FoodSearchComponent implements OnInit, OnDestroy {
  readonly comparisonOperators: readonly ComparisonOperatorOption[] =
    COMPARISON_OPERATORS;
  readonly pageSizeOptions = [10, 20, 50, 100];
  readonly skeletonItems = Array.from({ length: 6 }, (_, index) => index);

  searchForm!: FormGroup;

  categories: FoodCategory[] = [];
  classifications: FoodClassification[] = [];
  attributes: FoodAttribute[] = [];
  foods: Food[] = [];

  totalItems = 0;
  totalPages = 0;
  page = 1;
  pageSize = 10;

  loading = false;
  errorMessage: string | null = null;

  private readonly destroy$ = new Subject<void>();
  private readonly search$ = new Subject<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly foodApi: FoodApiService,
    private readonly classificationService: ClassificationService,
    private readonly attributeService: AttributeService,
    private readonly categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.listenToSearch();
    this.listenToFormChanges();
    this.loadCatalogData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get attributeFilters(): FormArray {
    return this.searchForm.get('attributeFilters') as FormArray;
  }

  get filterRows(): FormGroup[] {
    return this.attributeFilters.controls as FormGroup[];
  }

  get hasActiveFilters(): boolean {
    return this.activeFilterLabels.length > 0;
  }

  get activeFilterLabels(): string[] {
    if (!this.searchForm) {
      return [];
    }

    const value = this.searchForm.getRawValue();
    const labels: string[] = [];
    const searchText = (value.search ?? '').trim();

    if (searchText) {
      labels.push(`Texto: "${searchText}"`);
    }

    for (const categoryId of value.categoryIds ?? []) {
      const category = this.categories.find((item) => item.id === categoryId);
      labels.push(
        category ? `Categoría: ${category.name}` : `Categoría #${categoryId}`
      );
    }

    for (const classificationId of value.classificationIds ?? []) {
      const classification = this.classifications.find(
        (item) => item.id === classificationId
      );
      labels.push(
        classification
          ? `Clasificación: ${classification.name}`
          : `Clasificación #${classificationId}`
      );
    }

    for (const row of value.attributeFilters ?? []) {
      if (row.attributeId === null || row.value === null) {
        continue;
      }

      const attribute = this.attributes.find(
        (item) => item.id === Number(row.attributeId)
      );
      const operator = this.comparisonOperators.find(
        (item) => item.value === row.operator
      );

      labels.push(
        `${attribute?.name ?? 'Atributo'} ${operator?.symbol ?? row.operator} ${
          row.value
        }`
      );
    }

    if (value.sortAttributeId !== null) {
      const attribute = this.attributes.find(
        (item) => item.id === Number(value.sortAttributeId)
      );
      labels.push(
        `Orden: ${attribute?.name ?? 'Atributo'} (${
          value.sortDescending ? 'descendente' : 'ascendente'
        })`
      );
    }

    return labels;
  }

  get resultsLabel(): string {
    if (this.totalItems === 0) {
      return 'Sin alimentos para mostrar';
    }

    const firstItem = (this.page - 1) * this.pageSize + 1;
    const lastItem = Math.min(this.page * this.pageSize, this.totalItems);

    return `Mostrando ${firstItem}-${lastItem} de ${this.totalItems} alimentos`;
  }

  onSearch(): void {
    this.page = 1;
    this.search$.next();
  }

  onPageChange(event: PageEvent): void {
    const pageSizeChanged = event.pageSize !== this.pageSize;

    this.pageSize = event.pageSize;
    this.page = pageSizeChanged ? 1 : event.pageIndex + 1;
    this.search$.next();
  }

  addAttributeFilter(): void {
    this.attributeFilters.push(this.createFilterRow());
  }

  removeAttributeFilter(index: number): void {
    this.attributeFilters.removeAt(index);
  }

  clearSearchText(): void {
    this.searchForm.get('search')?.setValue('');
  }

  clearFilters(): void {
    this.attributeFilters.clear();
    this.searchForm.reset({
      search: '',
      categoryIds: [],
      classificationIds: [],
      sortAttributeId: null,
      sortDescending: false,
    });
  }

  trackByFoodId(_: number, food: Food): number {
    return food.id;
  }

  private buildForm(): void {
    this.searchForm = this.formBuilder.group({
      search: [''],
      categoryIds: [[]],
      classificationIds: [[]],
      attributeFilters: this.formBuilder.array([]),
      sortAttributeId: [null],
      sortDescending: [false],
    });
  }

  private createFilterRow(): FormGroup {
    return this.formBuilder.group({
      attributeId: [null, Validators.required],
      operator: ['Equal' as AttributeComparisonOperator, Validators.required],
      value: [null, Validators.required],
    });
  }

  private listenToSearch(): void {
    this.search$
      .pipe(
        switchMap(() => {
          this.loading = true;
          this.errorMessage = null;

          return this.foodApi
            .search(this.buildRequest(), this.page, this.pageSize)
            .pipe(
              catchError((error: unknown) => {
                this.errorMessage = this.getErrorMessage(error);
                return of(null);
              })
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((result) => {
        this.loading = false;

        if (!result) {
          return;
        }

        this.foods = result.items;
        this.totalItems = result.totalItems;
        this.totalPages = result.totalPages;
        this.page = result.page;
        this.pageSize = result.pageSize;
      });
  }

  private listenToFormChanges(): void {
    this.searchForm.valueChanges
      .pipe(debounceTime(350), takeUntil(this.destroy$))
      .subscribe(() => {
        this.page = 1;
        this.search$.next();
      });
  }

  private loadCatalogData(): void {
    forkJoin({
      categories: this.categoryService
        .getCategories()
        .pipe(catchError(() => of([] as FoodCategory[]))),
      classifications: this.classificationService
        .getClassifications()
        .pipe(catchError(() => of([] as FoodClassification[]))),
      attributes: this.attributeService
        .getAttributes()
        .pipe(catchError(() => of([] as FoodAttribute[]))),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ categories, classifications, attributes }) => {
        this.categories = categories;
        this.classifications = classifications;
        this.attributes = attributes;
        this.search$.next();
      });
  }

  private buildRequest(): FoodSearchRequest {
    const value = this.searchForm.getRawValue();
    const attributeFilters: FoodAttributeFilter[] = (
      value.attributeFilters as Array<{
        attributeId: number | null;
        operator: AttributeComparisonOperator;
        value: number | null;
      }>
    )
      .filter((filter) => filter.attributeId !== null && filter.value !== null)
      .map((filter) => ({
        attributeId: Number(filter.attributeId),
        operator: filter.operator,
        value: Number(filter.value),
      }));

    return {
      search: value.search?.trim() ? value.search.trim() : null,
      categoryIds: value.categoryIds ?? [],
      classificationIds: value.classificationIds ?? [],
      attributeFilters,
      sort:
        value.sortAttributeId !== null
          ? {
              attributeId: Number(value.sortAttributeId),
              descending: Boolean(value.sortDescending),
            }
          : null,
    };
  }

  private getErrorMessage(error: unknown): string {
    const httpError = error as {
      status?: number;
      error?: { message?: string };
    };

    if (httpError.status === 0) {
      return 'No se pudo conectar con la API. Verifica que NutriFood.Api esté ejecutándose y que el proxy esté configurado.';
    }

    if (httpError.status === 404) {
      return 'No se encontró el endpoint de búsqueda. Verifica la ruta /api/Food/seach.';
    }

    return (
      httpError.error?.message ??
      'Ocurrió un error inesperado al consultar los alimentos.'
    );
  }
}
