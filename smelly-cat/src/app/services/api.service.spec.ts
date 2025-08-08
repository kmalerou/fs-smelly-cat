import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpParams, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;
  let endpoint: string;
  let params: HttpParams;
  let body: { name: string };
  let errorResponse: { status: number; statusText: string; body: string };

  const apiBaseUrl = 'https://api.emailjs.com/api/v1.0/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
    endpoint = 'endpoint';
    params = new HttpParams().set('search', 'test');
    body = { name: 'test' };
    errorResponse = {
      status: 500,
      statusText: 'Server Error',
      body: 'Something went wrong',
    };
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#get()', () => {
    it('should make a GET request with headers and optional params and return expected data', () => {
      const responseData = { name: 'test' };
      service.get<typeof responseData>(endpoint, params).subscribe((res) => {
        expect(res)
          .withContext('Response from get() should match the expected')
          .toEqual(responseData);
      });

      const req = httpTestingController.expectOne(
        (request) =>
          request.method === 'GET' &&
          request.url === apiBaseUrl + endpoint &&
          request.params.get('search') === 'test',
      );
      req.flush(responseData);
    });

    it('should propagate error when GET request fails', () => {
      const errorText = 'Something went wrong';

      service.get(endpoint).subscribe({
        next: () =>
          fail(
            'Expected an error from GET request, but got a successful response',
          ),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Server Error');
        },
      });

      const req = httpTestingController.expectOne(apiBaseUrl + 'endpoint');
      req.flush(errorResponse.body, {
        status: errorResponse.status,
        statusText: errorResponse.statusText,
      });
    });
  });

  describe('#post()', () => {
    it('should make a POST request with headers and optional params and return expected data', () => {
      const responseData = { id: 1, name: 'test' };

      service
        .post<typeof body, typeof responseData>(endpoint, body, params)
        .subscribe((res) => {
          expect(res)
            .withContext('Response from post() should match the expected')
            .toEqual(responseData);
        });

      const req = httpTestingController.expectOne(
        (request) =>
          request.method === 'POST' &&
          request.body === body &&
          request.url === apiBaseUrl + endpoint &&
          request.params.get('search') === 'test',
      );
      req.flush(responseData);
    });

    it('should propagate error when POST request fails', () => {
      const errorText = 'Something went wrong';

      service.post(endpoint, body).subscribe({
        next: () =>
          fail(
            'Expected an error from POST request, but got a successful response',
          ),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Server Error');
        },
      });

      const req = httpTestingController.expectOne(apiBaseUrl + endpoint);
      req.flush(errorResponse.body, {
        status: errorResponse.status,
        statusText: errorResponse.statusText,
      });
    });
  });

  describe('#postText()', () => {
    it('should make a POST request with headers and optional params and responseType equal to text', () => {
      const responseData = 'OK';

      service.postText(endpoint, body, params).subscribe((res) => {
        expect(res)
          .withContext(
            'Response from postText() should match the expected string',
          )
          .toEqual(responseData);
      });

      const req = httpTestingController.expectOne(
        (request) =>
          request.method === 'POST' &&
          request.body === body &&
          request.url === apiBaseUrl + endpoint &&
          request.params.get('search') === 'test' &&
          request.responseType === 'text',
      );
      req.flush(responseData);
    });

    it('should propagate error when POST request with expected responseType text fails', () => {
      const errorText = 'Something went wrong';

      service.postText(endpoint, body).subscribe({
        next: () =>
          fail(
            'Expected an error from POST request with text responseType, but got a successful response',
          ),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Server Error');
        },
      });

      const req = httpTestingController.expectOne(apiBaseUrl + endpoint);
      req.flush(errorResponse.body, {
        status: errorResponse.status,
        statusText: errorResponse.statusText,
      });
    });
  });
});
