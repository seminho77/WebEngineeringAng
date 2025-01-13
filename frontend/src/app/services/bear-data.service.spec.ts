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

  it('fetchBearData should fetch and return wikitext from backend', () => {
    const mockResponse = { wikitext: 'mocked data' };

    service.fetchBearData('List_of_ursids', 3).subscribe((result: string) => {
      expect(result).toBe('mocked data');
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === 'http://localhost:5000/api/bears' &&
        r.params.get('title') === 'List_of_ursids' &&
        r.params.get('section') === '3'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('fetchImageUrl should return a URL if available from backend', () => {
    const mockImageResponse = { url: 'http://example.com/image.jpg' };

    service.fetchImageUrl('bear.jpg').subscribe((result: string) => {
      expect(result).toBe('http://example.com/image.jpg');
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === 'http://localhost:5000/api/images' &&
        r.params.get('fileName') === 'bear.jpg'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockImageResponse);
  });

  it('fetchImageUrl should return empty string if no image found', () => {
    const mockNoImageResponse = { url: '' };

    service.fetchImageUrl('nonexistent.jpg').subscribe((result: string) => {
      expect(result).toBe('');
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === 'http://localhost:5000/api/images' &&
        r.params.get('fileName') === 'nonexistent.jpg'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockNoImageResponse);
  });
});
