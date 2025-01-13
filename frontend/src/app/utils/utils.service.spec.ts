import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UtilsService } from './utils.service';

describe('UtilsService (Standalone)', () => {
  let service: UtilsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UtilsService],
    });
    service = TestBed.inject(UtilsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return the URL if the image exists (HTTP 2xx)', () => {
    const url = 'http://example.com/image.jpg';
    service.checkImageAvailability(url).subscribe((result) => {
      expect(result).toBe(url);
    });

    const req = httpMock.expectOne(url);

    expect(req.request.method).toBe('HEAD');
    req.flush({}, { status: 200, statusText: 'OK' });
  });

  it('should return placeholder if the image does not exist (non-2xx)', () => {
    const url = 'http://example.com/nonexistent.jpg';
    const placeholder =
      'https://via.placeholder.com/200x200.png?text=Image+Not+Available';

    service.checkImageAvailability(url).subscribe((result) => {
      expect(result).toBe(placeholder);
    });

    const req = httpMock.expectOne(url);
    req.flush({}, { status: 404, statusText: 'Not Found' });
  });
});
