export interface Area {
  slug: string;
  name: string;
}

export interface City {
  slug: string;
  name: string;
  areas: Area[];
}