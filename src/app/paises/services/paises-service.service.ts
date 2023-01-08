import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';

import { Country, Pais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private baseUrl = 'https://restcountries.com/v3.1';
  private _regiones: Array<string> = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): Array<string> {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) {}

  getPaisesPorRegion(region: string): Observable<Array<Pais>> {
    const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name`;

    return this.http.get<Array<Pais>>(url);
  }

  getPaisPorCodigo(codigo: string): Observable<Array<Country> | null> {
    if (!codigo) {
      return of(null);
    }

    const url = `${this.baseUrl}/alpha/${codigo}`;

    return this.http.get<Array<Country>>(url);
  }

  getPaisPorCodigoSmall(codigo: string): Observable<Array<Pais>> {
    const url = `${this.baseUrl}/alpha/${codigo}?fields=name,cca3`;

    return this.http.get<Pais[]>(url);
  }

  getPaisesPorCodigo(borders: Array<string>): Observable<Pais[][]> {
    if (!borders) {
      return of([]);
    }

    const peticiones: Observable<Pais[]>[] = [];

    borders.forEach((codigo) => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }
}
