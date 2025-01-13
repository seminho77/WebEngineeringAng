import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Bear } from '../models/bear.model';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface BearDataResponse {
  parse: {
    wikitext: {
      '*': string;
    };
  };
}

interface ImageDataResponse {
  query: {
    pages: Record<string, { imageinfo?: Array<{ url: string }> }>;
  };
}

@Injectable({
  providedIn: 'root',
})
export class BearService {
  private readonly BASE_URL = 'https://en.wikipedia.org/w/api.php';
  private readonly DEFAULT_TITLE = 'List_of_ursids';

  constructor(private http: HttpClient) {}

  fetchBearData(
    title: string = this.DEFAULT_TITLE,
    section = 3
  ): Observable<string> {
    const params = new HttpParams()
      .set('action', 'parse')
      .set('page', title)
      .set('prop', 'wikitext')
      .set('section', section.toString())
      .set('format', 'json')
      .set('origin', '*');

    return this.http.get<BearDataResponse>(this.BASE_URL, { params }).pipe(
      map((res) => res.parse.wikitext['*']),
      catchError((err) => {
        console.error('Error fetching bear data:', err);
        return throwError(() => new Error('Failed to fetch bear data'));
      })
    );
  }

  fetchImageUrl(fileName: string): Observable<string> {
    const params = new HttpParams()
      .set('action', 'query')
      .set('titles', `File:${fileName}`)
      .set('prop', 'imageinfo')
      .set('iiprop', 'url')
      .set('format', 'json')
      .set('origin', '*');

    return this.http.get<ImageDataResponse>(this.BASE_URL, { params }).pipe(
      map((data) => {
        const page = Object.values(data.query.pages)[0];
        return page?.imageinfo?.[0]?.url || '';
      }),
      catchError((err) => {
        console.error('Error fetching image URL:', err);
        return throwError(() => new Error('Failed to fetch image data'));
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
