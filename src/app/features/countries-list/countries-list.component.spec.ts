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

  const buildCountry = (index: number, region = 'Europe'): Country => ({
    cca3: `C${String(index).padStart(2, '0')}`,
    name: {
      common: `Country ${index}`,
      official: `Country ${index} Official`,
    },
    flags: {
      svg: `https://example.com/country-${index}.svg`,
      png: `https://example.com/country-${index}.png`,
    },
    capital: [`Capital ${index}`],
    region,
    population: 1000000 + index,
    area: 50000 + index,
    timezones: ['UTC+00:00'],
  });

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
    {
      cca3: 'JPN',
      name: {
        common: 'Japan',
        official: 'Japan',
      },
      flags: {
        svg: 'https://example.com/jpn.svg',
        png: 'https://example.com/jpn.png',
      },
      capital: ['Tokyo'],
      region: 'Asia',
      population: 125800000,
      area: 377975,
      timezones: ['UTC+09:00'],
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
    expect(compiled.querySelectorAll('.country-card').length).toBe(2);
    expect(compiled.textContent).toContain('United States');
    expect(compiled.textContent).toContain('Americas');
  });

  it('should filter countries by search keyword', () => {
    service.getCountries.and.returnValue(of(countries));

    fixture = TestBed.createComponent(CountriesListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const searchInput = compiled.querySelector(
      '.search-field input',
    ) as HTMLInputElement;

    searchInput.value = 'japan';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const cards = compiled.querySelectorAll('.country-card');
    expect(cards.length).toBe(1);
    expect(compiled.textContent).toContain('Japan');
    expect(compiled.textContent).not.toContain('United States');
  });

  it('should filter countries by selected region', () => {
    service.getCountries.and.returnValue(of(countries));

    fixture = TestBed.createComponent(CountriesListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const regionSelect = compiled.querySelector(
      '.region-filter select',
    ) as HTMLSelectElement;

    regionSelect.value = 'Americas';
    regionSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const cards = compiled.querySelectorAll('.country-card');
    expect(cards.length).toBe(1);
    expect(compiled.textContent).toContain('United States');
    expect(compiled.textContent).not.toContain('Japan');
  });

  it('should show empty state when search and filter produce no matches', () => {
    service.getCountries.and.returnValue(of(countries));

    fixture = TestBed.createComponent(CountriesListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const searchInput = compiled.querySelector(
      '.search-field input',
    ) as HTMLInputElement;

    searchInput.value = 'unknown-country';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.textContent).toContain('No countries found');
    expect(compiled.querySelectorAll('.country-card').length).toBe(0);
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
    expect(compiled.querySelectorAll('.country-card').length).toBe(2);
  });

  it('should render 12 countries per page', () => {
    const manyCountries = Array.from({ length: 13 }, (_, index) =>
      buildCountry(index + 1),
    );
    service.getCountries.and.returnValue(of(manyCountries));

    fixture = TestBed.createComponent(CountriesListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.country-card').length).toBe(12);
    expect(compiled.textContent).toContain('Country 1');
    expect(compiled.textContent).not.toContain('Country 13');
  });

  it('should navigate to next page and show remaining countries', () => {
    const manyCountries = Array.from({ length: 13 }, (_, index) =>
      buildCountry(index + 1),
    );
    service.getCountries.and.returnValue(of(manyCountries));

    fixture = TestBed.createComponent(CountriesListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const nextButton = Array.from(
      compiled.querySelectorAll('.pagination .pagination-button'),
    ).find((button) => button.textContent?.trim() === 'Next') as
      | HTMLButtonElement
      | undefined;

    expect(nextButton).toBeDefined();
    nextButton?.click();
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.country-card').length).toBe(1);
    const countryTitle = compiled.querySelector('.country-name')?.textContent;
    expect(countryTitle?.trim()).toBe('Country 13');
  });

  it('should reset pagination to first page when search changes', () => {
    const manyCountries = Array.from({ length: 13 }, (_, index) =>
      buildCountry(index + 1),
    );
    service.getCountries.and.returnValue(of(manyCountries));

    fixture = TestBed.createComponent(CountriesListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const nextButton = Array.from(
      compiled.querySelectorAll('.pagination .pagination-button'),
    ).find((button) => button.textContent?.trim() === 'Next') as
      | HTMLButtonElement
      | undefined;

    nextButton?.click();
    fixture.detectChanges();

    const searchInput = compiled.querySelector(
      '.search-field input',
    ) as HTMLInputElement;
    searchInput.value = 'Country 1';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.currentPage()).toBe(1);
    expect(compiled.textContent).toContain('Country 1');
  });

  it('should reset pagination to first page when region filter changes', () => {
    const manyCountries = [
      ...Array.from({ length: 12 }, (_, index) =>
        buildCountry(index + 1, 'Asia'),
      ),
      buildCountry(13, 'Africa'),
    ];
    service.getCountries.and.returnValue(of(manyCountries));

    fixture = TestBed.createComponent(CountriesListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const nextButton = Array.from(
      compiled.querySelectorAll('.pagination .pagination-button'),
    ).find((button) => button.textContent?.trim() === 'Next') as
      | HTMLButtonElement
      | undefined;

    nextButton?.click();
    fixture.detectChanges();

    const regionSelect = compiled.querySelector(
      '.region-filter select',
    ) as HTMLSelectElement;
    regionSelect.value = 'Africa';
    regionSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.currentPage()).toBe(1);
    expect(compiled.querySelectorAll('.country-card').length).toBe(1);
    expect(compiled.textContent).toContain('Country 13');
  });
});
