import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Poem } from '../models/poem.model';
import { PoetryApiError } from '../utils/api-error';

@Injectable({
    providedIn: 'root'
})

export class PoetryService {
    private readonly baseUrl = 'https://poetrydb.org';

    constructor(private http: HttpClient) {
        console.log('🔧 PoetryService constructor called');
    }

    /*****
     *  Get poems by Author
     *  Can be full name with spaces between strings or part of a name.
     *  Note: 'Emily Dickinson' and 'Emily Dickins' will get the same results,
     *          however 'Emil Dickinson' will return a 404. Without more time to look,
     *          it seems like it string matches with a * at the end.
     */
  getPoemsByAuthor(author: string): Observable<Poem[]> {
    const endpoint = `${this.baseUrl}/author/${encodeURIComponent(author)}`;
    
    return this.http.get<Poem[]>(endpoint).pipe(
      tap(poems => {
        console.log(`✅ Successfully retrieved ${poems.length} poems by ${author}`);
        console.log('Author data:', poems);
      }),
      catchError(error => this.handleError(error, endpoint))
    );
  }

    /*****
     * Get poems by Title
     */
    getPoemsByTitle(title: string): Observable<Poem[]> {
        const endpoint = `${this.baseUrl}/title/${encodeURIComponent(title)}`;

        return this.http.get<Poem[]>(endpoint).pipe(
            tap(poems => {
                console.log(`Sucessfully retrieved ${poems.length} poem${poems.length == 1 ? '' : 's'} with the title "${title}".`);
                console.log(`Poem${poems.length == 1 ? '' : 's'} titled ${title}: `, poems);
            }),
            catchError(error => this.handleError(error, endpoint))
        );
    }

    /*****
     * Get Titles by Author
     * 
     * Note: I was confused by the prompt until I got to the point of writing this endpoint.
     *  Keeping the other endpoints in since I already wrote them.
     */


    private handleError(error: HttpErrorResponse, endpoint: string): Observable<never> {
        console.error('❌ API Error occurred:', error);
        console.error('Endpoint:', endpoint);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        
        // Throw error for any non-200 status
        if (error.status !== 200) {
        const apiError = new PoetryApiError(
            error.status,
            endpoint,
            error.error?.message || error.message || 'Unknown error'
        );
        console.error('🚨 Throwing PoetryApiError:', apiError);
        return throwError(() => apiError);
        }
        
        return throwError(() => error);
    }

}

