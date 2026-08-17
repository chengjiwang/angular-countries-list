import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { distinctUntilChanged, filter, finalize, map } from 'rxjs';

import { CountryService } from '../../core/api/country.service';
import { Country } from '../../core/country.model';

type DetailItem = {
  label: string;
  value: string;
};

type BorderCountry = {
  code: string;
  name: string;
};

@Component({
  selector: 'app-country-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss',
})
export class CountryDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly countryService = inject(CountryService);
  private readonly destroyRef = inject(DestroyRef);

  readonly country = signal<Country | null>(null);
  readonly currentCode = signal<string | null>(null);
  readonly borderCountryNames = signal<Map<string, string>>(new Map());
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly isNotFound = signal(false);

  readonly primaryDetails = computed<DetailItem[]>(() => {
    const country = this.country();

    if (!country) {
      return [];
    }

    return [
      {
        label: 'Native Name',
        value: this.getNativeName(country),
      },
      {
        label: 'Population',
        value: this.formatNumber(country.population),
      },
      {
        label: 'Region',
        value: this.formatText(country.region),
      },
      {
        label: 'Sub Region',
        value: this.formatText(country.subregion),
      },
      {
        label: 'Capital',
        value: this.formatList(country.capital),
      },
    ];
  });

  readonly secondaryDetails = computed<DetailItem[]>(() => {
    const country = this.country();

    if (!country) {
      return [];
    }

    return [
      {
        label: 'Top Level Domain',
        value: this.formatList(country.topLevelDomain),
      },
      {
        label: 'Currencies',
        value: this.formatCurrencies(country),
      },
      {
        label: 'Languages',
        value: this.formatLanguages(country),
      },
    ];
  });

  readonly borderCountries = computed<BorderCountry[]>(() => {
    const country = this.country();

    if (!country) {
      return [];
    }

    const names = this.borderCountryNames();

    return (country.borders ?? []).map((code) => ({
      code,
      name: names.get(code.toUpperCase()) ?? code.toUpperCase(),
    }));
  });

  constructor() {
    this.loadBorderCountryNames();

    this.route.paramMap
      .pipe(
        map((params) => params.get('code')?.trim().toUpperCase() ?? null),
        filter((code): code is string => code !== null && code.length > 0),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((code) => this.loadCountry(code));
  }

  reload(): void {
    const code = this.currentCode();

    if (!code) {
      return;
    }

    this.loadCountry(code);
  }

  private loadBorderCountryNames(): void {
    this.countryService
      .getCountries()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (countries) => {
          const names = new Map<string, string>();

          countries.forEach((country) => {
            names.set(country.cca3.toUpperCase(), country.name.common);
          });

          this.borderCountryNames.set(names);
        },
        error: () => {
          this.borderCountryNames.set(new Map());
        },
      });
  }

  private loadCountry(code: string): void {
    this.currentCode.set(code);
    this.country.set(null);
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.isNotFound.set(false);

    this.countryService
      .getCountry(code)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (country) => {
          this.country.set(country);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.isNotFound.set(true);
            return;
          }

          this.errorMessage.set(error.message || 'Failed to load country.');
        },
      });
  }

  private formatText(value?: string): string {
    return value?.trim() || 'N/A';
  }

  private formatList(values?: string[]): string {
    return values && values.length > 0 ? values.join(', ') : 'N/A';
  }

  private formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  private formatCurrencies(country: Country): string {
    const currencies = Object.values(country.currencies ?? {});

    if (currencies.length === 0) {
      return 'N/A';
    }

    return currencies
      .map((currency) =>
        currency.symbol
          ? `${currency.name} (${currency.symbol})`
          : currency.name,
      )
      .join(', ');
  }

  private formatLanguages(country: Country): string {
    const languages = Object.values(country.languages ?? {});

    return languages.length > 0 ? languages.join(', ') : 'N/A';
  }

  private getNativeName(country: Country): string {
    return (
      country.nativeName?.trim() || country.name.official || country.name.common
    );
  }
}
