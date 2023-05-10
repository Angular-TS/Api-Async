import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, catchError, retry } from 'rxjs';

import { FoodTrucks } from '../model/food-trucks.model';

@Injectable({
  providedIn: 'root'
})
export class HttpDbService {
  Fake_API = 'http://localhost:3000/api/v1/food-trucks';

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders ({ 'Content-Type': 'application/json' })
  };

  checkError(error: HttpErrorResponse) {
    if(error.error instanceof ErrorEvent) {
      console.log(`ERROR OCURRED ${error.status}, BODY WAS: ${error.error}`);
    }
    else { console.log(`BACKEND RETURNED COD ${error.status}, BODY WAS: ${error.error}`); }
    return throwError (
      'SOMETHING HAPPEND WITH REQUEST, TRY AGAIN.'
    );
  }

  getFoodTrucks(): Observable<FoodTrucks> {
    return this.http.get<FoodTrucks>(this.Fake_API)
      .pipe(retry(1), catchError(this.checkError));
  }

  getItem(id: string): Observable<FoodTrucks> {
    return this.http.get<FoodTrucks>(`${this.Fake_API}/${id}`)
      .pipe(retry(1), catchError(this.checkError));
  }

  createFoodTrucks(foodTrucks: FoodTrucks): Observable<FoodTrucks> {
    return this.http.post<FoodTrucks>(this.Fake_API, JSON.stringify(foodTrucks), this.httpOptions)
      .pipe(retry(1), catchError(this.checkError));
  }
}
