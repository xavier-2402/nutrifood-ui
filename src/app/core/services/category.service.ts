import { Inject, Injectable } from '@angular/core';
import { FoodCategory } from '../models/food.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly api = 'FoodCategories';

  constructor(@Inject('BASE_URL') private readonly baseUrl:string,
  private readonly http:HttpClient, ) { }

    getCategories(): Observable<FoodCategory[]> {
      return this.http
        .get<ApiResponse<FoodCategory[]>>(
          `${this.baseUrl}/api/${this.api}/active`
        )
        .pipe(map((response) => response.data ?? []));
    }
}
