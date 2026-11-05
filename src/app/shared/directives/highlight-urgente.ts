import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2
} from '@angular/core';

import { PrioridadCita } from '../../core/models/cita.model';

@Directive({
  selector: '[appHighlightUrgente]',
  standalone: false
})
export class HighlightUrgenteDirective implements OnChanges {

  @Input('appHighlightUrgente')
  prioridad!: PrioridadCita;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(): void {

    const elemento = this.el.nativeElement;

    this.renderer.removeClass(elemento, 'table-success');
    this.renderer.removeClass(elemento, 'table-warning');
    this.renderer.removeClass(elemento, 'table-danger');

    if (this.prioridad === 'ESTABLE') {
      this.renderer.addClass(elemento, 'table-success');
    }

    if (this.prioridad === 'URGENCIA') {
      this.renderer.addClass(elemento, 'table-warning');
    }

    if (this.prioridad === 'EMERGENCIA') {
      this.renderer.addClass(elemento, 'table-danger');
    }
  }
}