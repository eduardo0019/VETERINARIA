import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Dueno } from '../../../../core/models/dueno.model';
import { Mascota, EspecieMascota } from '../../../../core/models/mascota.model';
import { StorageService } from '../../../../core/services/storage';

@Component({
  selector: 'app-mascota-form',
  templateUrl: './mascota-form.html',
  styleUrls: ['./mascota-form.css'],
  standalone: false
})
export class MascotaForm implements OnInit {
  form!: FormGroup;
  guardado = false;
  duenoGuardado = false;
  duenoIdGenerado: string | null = null;

  duenosRegistrados: any[] = [];
  modoDueno: 'existente' | 'nuevo' = 'existente';

  // "Exótico" reemplazado por "Otro"
  especies: EspecieMascota[] = ['Perro', 'Gato', 'Ave', 'Otro'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.cargarDuenos();
    this.initForm();
  }

  cargarDuenos(): void {
    let rawData: any[] = [];
    if (typeof (this.storageService as any).obtenerDuenos === 'function') {
      rawData = (this.storageService as any).obtenerDuenos() || [];
    } else {
      const dataLocal = localStorage.getItem('duenos');
      rawData = dataLocal ? JSON.parse(dataLocal) : [];
    }

    this.duenosRegistrados = rawData.map(d => ({
      id: d.id,
      nombre: d.nombreCompleto || d.nombre || 'Sin Nombre',
      dni: d.dni || '',
      telefono: d.telefono || '',
      email: d.correo || d.email || '',
      direccion: d.direccion || ''
    }));

    if (this.duenosRegistrados.length === 0) {
      this.modoDueno = 'nuevo';
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      dueno: this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
        telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9,}$')]],
        email: ['', [Validators.required, Validators.email]],
        direccion: ['', Validators.required]
      }),
      mascota: this.fb.group({
        nombre: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
        especie: [{ value: '', disabled: true }, Validators.required],
        especieOtra: [{ value: '', disabled: true }], // Campo dinámico si selecciona 'Otro'
        raza: [{ value: '', disabled: true }, Validators.required],
        peso: [{ value: '', disabled: true }, [Validators.required, Validators.min(0.1)]], // Nuevo campo Peso
        fechaNacimiento: [{ value: '', disabled: true }, Validators.required]
      })
    });

    // Escuchar cambios en la especie para activar/desactivar la especificación de 'Otro'
    this.mascotaGroup.get('especie')?.valueChanges.subscribe(valor => {
      const controlOtra = this.mascotaGroup.get('especieOtra');
      if (valor === 'Otro') {
        controlOtra?.setValidators([Validators.required]);
      } else {
        controlOtra?.clearValidators();
        controlOtra?.setValue('');
      }
      controlOtra?.updateValueAndValidity();
    });
  }

  get duenoGroup(): FormGroup {
    return this.form.get('dueno') as FormGroup;
  }

  get mascotaGroup(): FormGroup {
    return this.form.get('mascota') as FormGroup;
  }

  get esOtroEspecie(): boolean {
    return this.mascotaGroup.get('especie')?.value === 'Otro';
  }

  esInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  cambiarModoDueno(modo: 'existente' | 'nuevo'): void {
    this.modoDueno = modo;
    this.duenoIdGenerado = null;
    this.duenoGuardado = false;
    this.duenoGroup.reset();
    this.duenoGroup.enable();
    this.mascotaGroup.disable();
    this.mascotaGroup.reset();
  }

  seleccionarDuenoExistente(event: Event): void {
    const duenoId = (event.target as HTMLSelectElement).value;
    if (!duenoId) {
      this.duenoGroup.reset();
      return;
    }

    const seleccionado = this.duenosRegistrados.find(d => d.id === duenoId);
    if (seleccionado) {
      this.duenoGroup.patchValue({
        nombre: seleccionado.nombre,
        dni: seleccionado.dni,
        telefono: seleccionado.telefono,
        email: seleccionado.email,
        direccion: seleccionado.direccion
      });
    }
  }

  confirmarDueno(): void {
    if (this.duenoGroup.invalid) {
      this.duenoGroup.markAllAsTouched();
      return;
    }

    const valDueno = this.duenoGroup.getRawValue();

    if (this.modoDueno === 'nuevo') {
      this.duenoIdGenerado = 'DUE-' + Math.floor(100000 + Math.random() * 900000);
      
      const nuevoDuenoObjeto = {
        id: this.duenoIdGenerado,
        nombre: valDueno.nombre,
        nombreCompleto: valDueno.nombre,
        dni: valDueno.dni,
        telefono: valDueno.telefono,
        email: valDueno.email,
        correo: valDueno.email,
        direccion: valDueno.direccion
      };

      this.duenosRegistrados.push(nuevoDuenoObjeto);
      localStorage.setItem('duenos', JSON.stringify(this.duenosRegistrados));
      
      if (typeof (this.storageService as any).guardarDueno === 'function') {
        (this.storageService as any).guardarDueno(nuevoDuenoObjeto);
      }
    } else {
      const encontrado = this.duenosRegistrados.find(d => d.dni === valDueno.dni);
      this.duenoIdGenerado = encontrado ? encontrado.id : 'DUE-' + valDueno.dni;
    }

    this.duenoGuardado = true;
    this.duenoGroup.disable();
    this.mascotaGroup.enable();
  }

  editarDueno(): void {
    this.duenoGuardado = false;
    if (this.modoDueno === 'nuevo') {
      this.duenoGroup.enable();
    }
    this.mascotaGroup.disable();
    this.mascotaGroup.reset();
  }

  guardar(): void {
    if (this.mascotaGroup.invalid || !this.duenoIdGenerado) {
      this.mascotaGroup.markAllAsTouched();
      return;
    }

    const valMascota = this.mascotaGroup.getRawValue();
    const idMascota = 'MAS-' + Date.now();

    // Determinar la especie final (si fue 'Otro', toma el nombre especificado)
    const especieFinal = valMascota.especie === 'Otro' 
      ? `Otro (${valMascota.especieOtra})` 
      : valMascota.especie;

    const nuevaMascota = new Mascota(
      idMascota,
      valMascota.nombre,
      especieFinal as EspecieMascota,
      valMascota.raza,
      new Date(valMascota.fechaNacimiento),
      this.duenoIdGenerado
    );

    // Asignar el peso a la instancia
    (nuevaMascota as any).peso = valMascota.peso;

    if (typeof (this.storageService as any).guardarMascota === 'function') {
      (this.storageService as any).guardarMascota(nuevaMascota);
    } else {
      const mascotasGuardadas = JSON.parse(localStorage.getItem('mascotas') || '[]');
      mascotasGuardadas.push(nuevaMascota);
      localStorage.setItem('mascotas', JSON.stringify(mascotasGuardadas));
    }

    this.guardado = true;
    setTimeout(() => {
      this.router.navigate(['/mascotas']);
    }, 1500);
  }

  cancelar(): void {
    this.router.navigate(['/mascotas']);
  }
}