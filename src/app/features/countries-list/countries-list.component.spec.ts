import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, Subject, of, throwError } from 'rxjs';

import { Country } from '../../core/country.model';
import { CountryService } from '../../core/api/country.service';
import { CountriesListComponent } from './countries-list.component';

class CountryServiceStub {
  getCountries = jasmine
    .createSpy('getCountries')
    .and.returnValue(of([]) as Observable<Country[]>);
}

describe('CountriesListComponent', () => {
  let fixture: ComponentFixture<CountriesListComponent>;
  let service: CountryServiceStub;

  const countries: Country[] = [
    {
      cca3: 'USA',
      name: {
        common: 'United States',
        official: 'United States of America',
      },
      flags: {
        svg: 'https://example.com/usa.svg',
        png: 'https://example.com/usa.png',
      },
      capital: ['Washington, D.C.'],
      region: 'Americas',
      population: 331000000,
      area: 9833520,
      timezones: ['UTC-05:00'],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountriesListComponent],
      providers: [
        provideRouter([]),
        {
          provide: CountryService,
          useClass: CountryServiceStub,
        },
      ],
    }).compileComponents();

    service = TestBed.inject(CountryService) as unknown as CountryServiceStub;
  });

  it('should show loading state while countries are being fetched', () => {
    const loading$ = new Subject<Country[]>();
    service.getCountries.and.returnValue(loading$.asObservable());

    fixture = TestBed.createComponent(CountriesListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Loading countries...');

    loading$.next(countries);
    loading$.complete();
  });

  it('should render country cards when API returns countries', () => {
    service.getCountries.and.returnValue(of(countries));

    fixture = TestBed.createComponent(CountriesListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.country-card').length).toBe(1);
    expect(compiled.textContent).toContain('United States');
    expect(compiled.textContent).toContain('Americas');
  });

  it('should show empty state when API returns no countries', () => {
    service.getCountries.and.returnValue(of([]));

    fixture = TestBed.createComponent(CountriesListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No countries found');
  });

  it('should show error state and reload on retry', () => {
    service.getCountries.and.returnValues(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 500,
            statusText: 'Server Error',
            url: '/api/countries',
          }),
      ),
      of(countries),
    );

    fixture = TestBed.createComponent(CountriesListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Could not load countries');

    const retryButton = compiled.querySelector(
      '.retry-button',
    ) as HTMLButtonElement;
    retryButton.click();
    fixture.detectChanges();

    expect(service.getCountries).toHaveBeenCalledTimes(2);
    expect(compiled.querySelectorAll('.country-card').length).toBe(1);
  });
});
