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
  readonly searchKeyword = signal('');
  readonly selectedRegion = signal('');
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly regions = computed(() => {
    const uniqueRegions = new Set(
      this.countries()
        .map((country) => country.region.trim())
        .filter((region) => region.length > 0),
    );

    return Array.from(uniqueRegions).sort((a, b) => a.localeCompare(b));
  });

  readonly filteredCountries = computed(() => {
    const keyword = this.searchKeyword().trim().toLowerCase();
    const region = this.selectedRegion();

    return this.countries().filter((country) => {
      const matchesKeyword =
        keyword.length === 0 ||
        country.name.common.toLowerCase().includes(keyword) ||
        country.name.official.toLowerCase().includes(keyword) ||
        country.cca3.toLowerCase().includes(keyword);

      const matchesRegion = region.length === 0 || country.region === region;

      return matchesKeyword && matchesRegion;
    });
  });

  readonly isEmpty = computed(
    () =>
      !this.isLoading() &&
      this.errorMessage() === null &&
      this.filteredCountries().length === 0,
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

  onSearchChange(value: string): void {
    this.searchKeyword.set(value);
  }

  onRegionChange(value: string): void {
    this.selectedRegion.set(value);
  }
}
