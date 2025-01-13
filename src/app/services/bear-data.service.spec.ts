import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { BearService } from './bear-data.service';

describe('BearService', () => {
  let service: BearService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BearService],
    });
    service = TestBed.inject(BearService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetchBearData should fetch and return wikitext', () => {
    const mockResponse = { parse: { wikitext: { '*': 'mocked data' } } };

    service.fetchBearData('List_of_ursids').subscribe((result: string) => {
      expect(result).toBe('mocked data');
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === 'https://en.wikipedia.org/w/api.php' &&
        r.params.get('page') === 'List_of_ursids'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('fetchImageUrl should return a URL if available', () => {
    const mockImage = {
      query: {
        pages: {
          '1': {
            imageinfo: [{ url: 'http://example.com/image.jpg' }],
          },
        },
      },
    };

    service.fetchImageUrl('bear.jpg').subscribe((result: string) => {
      expect(result).toBe('http://example.com/image.jpg');
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url.includes('w/api.php') &&
        r.params.get('titles') === 'File:bear.jpg'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockImage);
  });

  it('fetchImageUrl should return empty string if no image found', () => {
    const mockNoImage = { query: { pages: { '1': {} } } };

    service.fetchImageUrl('nonexistent.jpg').subscribe((result: string) => {
      expect(result).toBe('');
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url.includes('w/api.php') &&
        r.params.get('titles') === 'File:nonexistent.jpg'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockNoImage);
  });
});
