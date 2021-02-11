import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchUscService {
  serverName = 'http://localhost:8000';

  constructor(private http: HttpClient) {
  }

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
      .pipe(map((data: any) => data.body || []), catchError(error => {
        return throwError('Error getting data!');
      }));
  }

/*  getMock(value: string): Observable<any> {
    const url = 'assets/data/mock.json';
    return this.http
      .get<any>(url)
      .pipe(
        first(),
        map(res =>
          res.hits.hits.filter((r: any) =>
            r._source.text.toLowerCase().includes(value.toLowerCase()) ||
            r._source.heading.toLowerCase().includes(value.toLowerCase())
          )),
        catchError(error => {
          return throwError('Error getting data!');
        })
      );
  }*/

  getData(url: string): Observable<any> {
    const fullUrl = `${environment.serverName}${url}`;
    return this.http.get<any>(fullUrl)
      .pipe(
        first(),
        catchError(error => {
          return throwError('Error getting data!');
        })
      );
  }
}
