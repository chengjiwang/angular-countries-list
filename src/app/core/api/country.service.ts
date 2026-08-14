import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Country } from '../country.model';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private readonly http = inject(HttpClient);

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>('/api/countries');
  }

  getCountry(code: string): Observable<Country> {
    return this.http.get<Country>(`/api/countries/${code}`);
  }
}
