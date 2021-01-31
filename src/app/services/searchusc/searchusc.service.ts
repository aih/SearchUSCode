import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchUscService {

  constructor(private http: HttpClient) {}

  public getUSCSections(query: string): Observable<any> {
    const url = 'assets/data/usc_sections.json';
    return this.http
      .get<any>(url, {
        observe: 'response',
        params: {
          q: query,
          order: 'desc'
        }
      })
      .pipe(map((data: any) => data.body || [] ), catchError(error => {
            return throwError('Error getting data!');
          }));
  }
}
