import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FoodClassification } from '../models/food.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {

  private readonly api = 'FoodClassifications';

  constructor(@Inject('BASE_URL') private readonly baseUrl:string,
  private readonly http:HttpClient, ) { }

    getClassifications(): Observable<FoodClassification[]> {
      return this.http
        .get<ApiResponse<FoodClassification[]>>(
          `${this.baseUrl}/api/${this.api}/active`
        )
        .pipe(map((response) => response.data ?? []));
    }
}
