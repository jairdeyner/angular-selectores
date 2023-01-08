import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { Country, Pais } from '../../interfaces/paises.interface';

import { PaisesService } from '../../services/paises-service.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css'],
})
export class SelectorPageComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  });

  // Llenar selectores
  regiones: Array<string> = [];
  paises: Array<Pais> = [];
  // fronteras: Array<string> = [];
  fronteras: Array<Pais> = [];

  // UI
  cargando: boolean = false;

  constructor(private fb: FormBuilder, private paisesService: PaisesService) {}

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // Cuando cambie la region
    // this.miFormulario.get('region')?.valueChanges.subscribe((region) => {
    //   this.paisesService.getPaisesPorRegion(region).subscribe((paises) => (this.paises = paises));
    // });

    this.miFormulario
      .get('region')
      ?.valueChanges.pipe(
        tap((_) => {
          this.paises = [];
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap((region) => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe((paises) => {
        this.paises = paises;
        this.cargando = false;
      });

    this.miFormulario
      .get('pais')
      ?.valueChanges.pipe(
        tap((_) => {
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap((codigo) => this.paisesService.getPaisPorCodigo(codigo)),
        switchMap((pais) => this.paisesService.getPaisesPorCodigo(pais?.[0].borders!))
      )
      .subscribe((paises) => {
        // TODO: Here
        // this.fronteras = pais ? pais[0].borders : [];
        // this.fronteras = paises;
        // this.cargando = false;
      });
  }

  guardar() {
    console.log(this.miFormulario.value);
  }
}
