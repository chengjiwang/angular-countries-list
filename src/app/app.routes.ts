import { Routes } from '@angular/router';
import { CountriesListComponent } from './features/countries-list/countries-list.component';
import { CountryDetailComponent } from './features/country-detail/country-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/countries', pathMatch: 'full' },
  { path: 'countries', component: CountriesListComponent },
  { path: 'countries/:code', component: CountryDetailComponent },
  { path: '**', redirectTo: '/countries' },
];
