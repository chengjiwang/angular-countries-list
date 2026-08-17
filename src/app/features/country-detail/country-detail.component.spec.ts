/// <reference types="jasmine" />

import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
} from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

import { CountryService } from '../../core/api/country.service';
import { Country } from '../../core/country.model';
import { CountryDetailComponent } from './country-detail.component';

class CountryServiceStub {
  getCountries = jasmine
    .createSpy('getCountries')
    .and.returnValue(of([]) as Observable<Country[]>);

  getCountry = jasmine
    .createSpy('getCountry')
    .and.returnValue(of(null) as unknown as Observable<Country>);
}

describe('CountryDetailComponent', () => {
  let fixture: ComponentFixture<CountryDetailComponent>;
  let service: CountryServiceStub;
  let routeParams$: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  const countryList: Country[] = [
    {
      cca3: 'BEL',
      name: {
        common: 'Belgium',
        official: 'Kingdom of Belgium',
      },
      nativeName: 'België',
      flags: {
        svg: 'https://example.com/bel.svg',
        png: 'https://example.com/bel.png',
      },
      capital: ['Brussels'],
      topLevelDomain: ['.be'],
      region: 'Europe',
      subregion: 'Western Europe',
      population: 11319511,
      area: 30528,
      languages: {
        nld: 'Dutch',
        fra: 'French',
        deu: 'German',
      },
      currencies: {
        EUR: {
          name: 'Euro',
          symbol: '€',
        },
      },
      timezones: ['UTC+01:00'],
      borders: ['FRA', 'DEU', 'NLD'],
    },
    {
      cca3: 'FRA',
      name: {
        common: 'France',
        official: 'French Republic',
      },
      flags: {
        svg: 'https://example.com/fra.svg',
        png: 'https://example.com/fra.png',
      },
      region: 'Europe',
      population: 68000000,
      area: 551695,
      timezones: ['UTC+01:00'],
    },
  ];

  beforeEach(async () => {
    routeParams$ = new BehaviorSubject(convertToParamMap({ code: 'BEL' }));

    await TestBed.configureTestingModule({
      imports: [CountryDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: routeParams$.asObservable(),
          },
        },
        {
          provide: CountryService,
          useClass: CountryServiceStub,
        },
      ],
    }).compileComponents();

    service = TestBed.inject(CountryService) as unknown as CountryServiceStub;
  });

  it('should show loading state while country details are being fetched', () => {
    service.getCountries.and.returnValue(of(countryList));
    service.getCountry.and.returnValue(new Observable<Country>(() => {}));

    fixture = TestBed.createComponent(CountryDetailComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Loading country...');
  });

  it('should render country details and border countries', () => {
    service.getCountries.and.returnValue(of(countryList));
    service.getCountry.and.returnValue(of(countryList[0]));

    fixture = TestBed.createComponent(CountryDetailComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Belgium');
    expect(compiled.textContent).toContain('België');
    expect(compiled.textContent).toContain('Euro (€)');
    expect(compiled.textContent).toContain('France');
    expect(compiled.textContent).not.toContain('Country Code');
    expect(compiled.textContent).not.toContain('Area');
    expect(compiled.textContent).not.toContain('Timezones');

    const borderLinks = compiled.querySelectorAll('.border-chip');
    expect(borderLinks.length).toBe(3);
    expect(borderLinks[0].getAttribute('href')).toContain('/countries/FRA');
  });

  it('should show not found state when API returns 404', () => {
    service.getCountries.and.returnValue(of(countryList));
    service.getCountry.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 404,
            statusText: 'Not Found',
            url: '/api/countries/BEL',
          }),
      ),
    );

    fixture = TestBed.createComponent(CountryDetailComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Country not found');
  });

  it('should show error state when API returns a non-404 error', () => {
    service.getCountries.and.returnValue(of(countryList));
    service.getCountry.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 500,
            statusText: 'Server Error',
            url: '/api/countries/BEL',
          }),
      ),
    );

    fixture = TestBed.createComponent(CountryDetailComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Could not load country');
  });
});
