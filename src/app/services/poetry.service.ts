import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Poem } from '../models/poem.model';
import { PoetryApiError } from '../utils/api-error';

@Injectable({
  providedIn: 'root'
})
export class PoetryService {
  private readonly baseUrl = 'https://poetrydb.org';

  constructor(private http: HttpClient) {}

  /*** 
   * Response normalizer since sometimes a single item is an object instead of an array
   */
  private normalizeResponse(response: Poem | Poem[]): Poem[] {
    if (Array.isArray(response)) {
      console.log('Response is array:', response.length, 'items');
      return response;
    } else if (response && typeof response === 'object') {
      console.log('Response is single object, wrapping in array');
      return [response];
    } else {
      console.log('Unexpected response format:', typeof response);
      return [];
    }
  }

  /***
   * Get poems by Author
   */
  getPoemsByAuthor(author: string): Observable<Poem[]> {
    const endpoint = `${this.baseUrl}/author/${encodeURIComponent(author)}`;
    console.log('Making request to:', endpoint);

    return this.http.get<Poem | Poem[]>(endpoint).pipe(
      map(this.normalizeResponse),
      tap((poems) => {
        console.log(`Retrieved ${poems.length} poem${poems.length > 1 ? 's' : ''} by ${author}`);
      }),
      catchError((error) => this.handleError(error, endpoint))
    );
  }

  /***
   * Get poems by Title
   */
  getPoemsByTitle(title: string): Observable<Poem[]> {
    const endpoint = `${this.baseUrl}/title/${encodeURIComponent(title)}`;
    console.log('Making request to:', endpoint);

    return this.http.get<Poem | Poem[]>(endpoint).pipe(
      map(this.normalizeResponse),
      tap((poems) => {
        console.log(`Retrieved ${poems.length} poem(${poems.length > 1 ? 's' : ''} titled "${title}"`);
      }),
      catchError((error) => this.handleError(error, endpoint))
    );
  }

  /***
   * Get poems by Author and Title 
   */
  getPoemsByAuthorAndTitle(author: string, title: string): Observable<Poem[]> {
    const endpoint = `${this.baseUrl}/author,title/${encodeURIComponent(author)};${encodeURIComponent(title)}`;
    console.log('Making request to:', endpoint);

    return this.http.get<Poem | Poem[]>(endpoint).pipe(
      map(this.normalizeResponse),
      tap((poems) => {
        console.log(`Retrieved ${poems.length} poem${poems.length > 1 ? 's' : ''} by ${author} titled "${title}"`);
      }),
      catchError((error) => this.handleError(error, endpoint))
    );
  }

  /***
   * Error Handling 
   */
  private handleError(error: HttpErrorResponse, endpoint: string): Observable<never> {
    console.error('API Error occurred:', error);
    console.error('Endpoint:', endpoint);
    console.error('Status:', error.status);
    console.error('Message:', error.message);

    if (error.status !== 200) {
      const apiError = new PoetryApiError(
        error.status,
        endpoint,
        error.error?.message || error.message || 'Unknown error'
      );
      console.error('Throwing PoetryApiError:', apiError);
      return throwError(() => apiError);
    }

    return throwError(() => error);
  }
}
