import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
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
  private readonly api = 'Food';

  constructor(@Inject('BASE_URL') private readonly baseUrl:string,
  private readonly http: HttpClient) {}

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
        `${this.baseUrl}/api/${this.api}/seach`,
        request,
        { params }
      )
      .pipe(map((response) => response.data));
  }
}
