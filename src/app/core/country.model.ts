export interface Country {
  cca3: string;
  name: {
    common: string;
    official: string;
  };
  flags: {
    svg: string;
    png: string;
    alt?: string;
  };
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area: number;
  languages?: Record<string, string>;
  currencies?: Record<
    string,
    {
      name: string;
      symbol?: string;
    }
  >;
  timezones: string[];
  borders?: string[];
}
