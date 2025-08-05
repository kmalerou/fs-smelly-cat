import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly API_URL = 'https://api.emailjs.com/api/v1.0/';

  private http = inject(HttpClient);

  public get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(this.API_URL + url, {
      headers: this.getHeaders(),
      params: params,
    });
  }

  public post<T, R>(url: string, body: T, params?: HttpParams): Observable<R> {
    return this.http.post<R>(this.API_URL + url, body, {
      headers: this.getHeaders(),
      params: params,
    });
  }

  public postText<T>(
    url: string,
    body: T,
    params?: HttpParams,
  ): Observable<string> {
    return this.http.post(this.API_URL + url, body, {
      headers: this.getHeaders(),
      params: params,
      responseType: 'text',
    });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }
}
