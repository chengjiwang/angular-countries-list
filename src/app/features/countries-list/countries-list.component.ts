import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Country } from '../../core/country.model';
import { CountryService } from '../../core/api/country.service';

@Component({
  selector: 'app-countries-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './countries-list.component.html',
  styleUrl: './countries-list.component.scss',
})
export class CountriesListComponent {
  private readonly countryService = inject(CountryService);

  readonly countries = signal<Country[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly isEmpty = computed(
    () =>
      !this.isLoading() &&
      this.errorMessage() === null &&
      this.countries().length === 0,
  );

  constructor() {
    this.loadCountries();
  }

  loadCountries(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.countryService
      .getCountries()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (countries) => {
          this.countries.set(countries);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage.set(error.message || 'Failed to load countries.');
          this.countries.set([]);
        },
      });
  }

  getCapital(country: Country): string {
    return country.capital?.[0] ?? 'N/A';
  }
}
