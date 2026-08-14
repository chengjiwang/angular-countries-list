import { HttpResponse, http } from 'msw';

import { Country } from '../app/core/country.model';
import countriesData from './data/countries.json';

const rawCountries = countriesData as Array<Record<string, unknown>>;

function normalizeCountry(country: Record<string, unknown>): Country {
  const name = (country['name'] ?? {}) as Record<string, unknown>;
  const flags = (country['flags'] ?? {}) as Record<string, unknown>;
  const languages = (country['languages'] ?? []) as Array<
    Record<string, unknown>
  >;
  const currencies = (country['currencies'] ?? []) as Array<
    Record<string, unknown>
  >;

  const languageMap = Object.fromEntries(
    languages.map((language) => {
      const code = String(
        language['iso639_1'] ??
          language['iso639_2'] ??
          language['name'] ??
          'unknown',
      );
      return [code, String(language['name'] ?? language['nativeName'] ?? code)];
    }),
  );

  const currencyMap = Object.fromEntries(
    currencies.map((currency) => {
      const code = String(currency['code'] ?? 'unknown');
      return [
        code,
        {
          name: String(currency['name'] ?? code),
          symbol:
            typeof currency['symbol'] === 'string'
              ? currency['symbol']
              : undefined,
        },
      ];
    }),
  );

  return {
    cca3: String(country['cca3'] ?? country['alpha3Code'] ?? ''),
    name: {
      common: String(
        name['common'] ?? name['official'] ?? country['name'] ?? '',
      ),
      official: String(
        name['official'] ?? name['common'] ?? country['name'] ?? '',
      ),
    },
    flags: {
      svg: String(flags['svg'] ?? country['flag'] ?? ''),
      png: String(flags['png'] ?? country['flag'] ?? ''),
      alt: typeof flags['alt'] === 'string' ? flags['alt'] : undefined,
    },
    capital: Array.isArray(country['capital'])
      ? (country['capital'] as string[])
      : typeof country['capital'] === 'string'
        ? [country['capital']]
        : [],
    region: String(country['region'] ?? ''),
    subregion:
      typeof country['subregion'] === 'string'
        ? country['subregion']
        : undefined,
    population: Number(country['population'] ?? 0),
    area: Number(country['area'] ?? 0),
    languages: Object.keys(languageMap).length > 0 ? languageMap : undefined,
    currencies: Object.keys(currencyMap).length > 0 ? currencyMap : undefined,
    timezones: Array.isArray(country['timezones'])
      ? (country['timezones'] as string[])
      : typeof country['timezones'] === 'string'
        ? [country['timezones']]
        : [],
    borders: Array.isArray(country['borders'])
      ? (country['borders'] as string[])
      : [],
  };
}

const countries = rawCountries.map(normalizeCountry);

export const handlers = [
  http.get('/api/countries', () => {
    return HttpResponse.json(countries);
  }),

  http.get('/api/countries/:code', ({ params }) => {
    const code = String(params['code'] ?? '').toLowerCase();
    const country = countries.find(
      (item) =>
        item.cca3.toLowerCase() === code ||
        item.name.common.toLowerCase() === code,
    );

    if (!country) {
      return HttpResponse.json(
        { message: 'Country not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(country);
  }),
];
