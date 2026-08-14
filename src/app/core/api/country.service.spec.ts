/// <reference types="jasmine" />

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Country } from '../country.model';
import { CountryService } from './country.service';

describe('CountryService', () => {
  let service: CountryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CountryService],
    });

    service = TestBed.inject(CountryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should request all countries from the mock API', () => {
    const countries: Country[] = [
      {
        cca3: 'USA',
        name: { common: 'United States', official: 'United States of America' },
        flags: {
          svg: 'https://example.com/usa.svg',
          png: 'https://example.com/usa.png',
        },
        region: 'Americas',
        population: 331000000,
        area: 9833520,
        timezones: ['UTC-05:00'],
      },
    ];

    service.getCountries().subscribe((result) => {
      expect(result).toEqual(countries);
    });

    const req = httpMock.expectOne('/api/countries');
    expect(req.request.method).toBe('GET');
    req.flush(countries);
  });

  it('should request a country by code from the mock API', () => {
    const country: Country = {
      cca3: 'USA',
      name: { common: 'United States', official: 'United States of America' },
      flags: {
        svg: 'https://example.com/usa.svg',
        png: 'https://example.com/usa.png',
      },
      region: 'Americas',
      population: 331000000,
      area: 9833520,
      timezones: ['UTC-05:00'],
    };

    service.getCountry('usa').subscribe((result) => {
      expect(result).toEqual(country);
    });

    const req = httpMock.expectOne('/api/countries/usa');
    expect(req.request.method).toBe('GET');
    req.flush(country);
  });
});
