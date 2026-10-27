import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import { FoodAttribute } from '../models/food.model';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  private readonly api = 'FoodAttributes';


  constructor(@Inject('BASE_URL') private readonly baseUrl:string,
  private readonly http:HttpClient, ) { }

  getAttributes(): Observable<FoodAttribute[]> {
    return this.http
      .get<ApiResponse<FoodAttribute[]>>(
        `${this.baseUrl}/api/${this.api}/active`
      )
      .pipe(map((response) => response.data ?? []));
    }
}
