import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import {
  Food,
  FoodAttribute,
  FoodCategory,
  FoodClassification,
} from '../models/food.model';
import {
  FoodSearchRequest,
  PageResult,
} from '../models/food-search.model';

@Injectable({ providedIn: 'root' })
export class FoodApiService {
  private readonly baseUrl = 'http://localhost:5158/api';

  constructor(private readonly http: HttpClient) {}

  getCategories(): Observable<FoodCategory[]> {
    return this.http
      .get<ApiResponse<FoodCategory[]>>(
        `${this.baseUrl}/FoodCategories/active`
      )
      .pipe(map((response) => response.data ?? []));
  }

  getClassifications(): Observable<FoodClassification[]> {
    return this.http
      .get<ApiResponse<FoodClassification[]>>(
        `${this.baseUrl}/FoodClassifications/active`
      )
      .pipe(map((response) => response.data ?? []));
  }

  getAttributes(): Observable<FoodAttribute[]> {
    return this.http
      .get<ApiResponse<FoodAttribute[]>>(
        `${this.baseUrl}/FoodAttributes/active`
      )
      .pipe(map((response) => response.data ?? []));
  }

  search(
    request: FoodSearchRequest,
    page: number,
    size: number
  ): Observable<PageResult<Food>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http
      .post<ApiResponse<PageResult<Food>>>(
        `${this.baseUrl}/Food/seach`,
        request,
        { params }
      )
      .pipe(map((response) => response.data));
  }
}
