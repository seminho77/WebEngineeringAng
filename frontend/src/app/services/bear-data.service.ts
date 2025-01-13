import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Bear } from '../models/bear.model';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BearService {
  private readonly BACKEND_URL = 'http://localhost:5000/api';
  private readonly DEFAULT_TITLE = 'List_of_ursids';

  constructor(private http: HttpClient) {}

  fetchBearData(
    title: string = this.DEFAULT_TITLE,
    section = 3
  ): Observable<string> {
    const params = new HttpParams()
      .set('title', title)
      .set('section', section.toString());

    return this.http.get<{ wikitext: string }>(`${this.BACKEND_URL}/bears`, { params }).pipe(
      map((res) => res.wikitext),
      catchError((err) => {
        console.error('Error fetching bear data from backend:', err);
        return throwError(() => new Error('Failed to fetch bear data from backend'));
      })
    );
  }

  fetchImageUrl(fileName: string): Observable<string> {
    const params = new HttpParams().set('fileName', fileName);

    return this.http.get<{ url: string }>(`${this.BACKEND_URL}/images`, { params }).pipe(
      map((res) => res.url),
      catchError((err) => {
        console.error('Error fetching image URL from backend:', err);
        return throwError(() => new Error('Failed to fetch image data from backend'));
      })
    );
  }

  extractBearData(wikitext: string): Observable<Bear[]> {
    const speciesTables = wikitext.split('{{Species table/end}}');
    const imageFetches: Array<Observable<Bear>> = [];

    for (const table of speciesTables) {
      const rows = table.split('{{Species table/row');
      for (const row of rows) {
        const nameMatch = row.match(/\|name=\[\[(.*?)\]\]/);
        const binomialMatch = row.match(/\|binomial=(.*?)\n/);
        const imageMatch = row.match(/\|image=(.*?)\n/);
        const rangeMatch = row.match(/\|range=([^|\n]+)/);

        if (nameMatch && binomialMatch && imageMatch) {
          const rawRange =
            rangeMatch && rangeMatch[1]?.trim() !== ''
              ? rangeMatch[1].trim()
              : 'Range information not available';
          const range = rawRange.replace(/\s*\(.*?\)\s*/g, '');
          const fileName = imageMatch[1].trim().replace('File:', '');

          const bearObs = this.fetchImageUrl(fileName).pipe(
            map(
              (imageUrl) =>
                ({
                  name: nameMatch[1],
                  binomial: binomialMatch[1],
                  image: imageUrl,
                  range,
                }) as Bear
            )
          );

          imageFetches.push(bearObs);
        }
      }
    }

    if (imageFetches.length === 0) {
      return new Observable<Bear[]>((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }

    return new Observable<Bear[]>((subscriber) => {
      const bears: Bear[] = [];
      let completed = 0;

      imageFetches.forEach((obs) => {
        obs.subscribe({
          next: (bear) => bears.push(bear),
          error: (err) => console.error('Error extracting bear data:', err),
          complete: () => {
            completed++;
            if (completed === imageFetches.length) {
              subscriber.next(bears);
              subscriber.complete();
            }
          },
        });
      });
    });
  }
}
