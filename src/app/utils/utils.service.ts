import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private http: HttpClient) {}

  /**
   * HEAD request to check if an image exists.
   * Returns a placeholder if the request fails or status is not 2xx.
   */
  checkImageAvailability(url: string): Observable<string> {
    return this.http.head(url, { observe: 'response' }).pipe(
      map((response) => {
        if (response.status >= 200 && response.status < 300) {
          return url;
        } else {
          return 'https://via.placeholder.com/200x200.png?text=Image+Not+Available';
        }
      }),
      catchError((err) => {
        console.error('Error checking image availability:', err);
        return of(
          'https://via.placeholder.com/200x200.png?text=Image+Not+Available'
        );
      })
    );
  }
}
