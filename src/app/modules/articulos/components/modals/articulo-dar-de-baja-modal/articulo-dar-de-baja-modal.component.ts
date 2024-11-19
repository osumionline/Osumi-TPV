import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { StatusResult } from '@interfaces/interfaces';
import { CustomOverlayRef, DialogService } from '@osumi/angular-tools';
import ArticulosService from '@services/articulos.service';

@Component({
  standalone: true,
  selector: 'otpv-articulo-dar-de-baja-modal',
  templateUrl: './articulo-dar-de-baja-modal.component.html',
  styleUrls: ['./articulo-dar-de-baja-modal.component.scss'],
  imports: [MatButton],
})
export default class ArticuloDarDeBajaModalComponent implements OnInit {
  private dialog: DialogService = inject(DialogService);
  private ars: ArticulosService = inject(ArticulosService);
  private customOverlayRef: CustomOverlayRef<
    null,
    { id: number; nombre: string }
  > = inject(CustomOverlayRef<null, { id: number; nombre: string }>);

  id: number;
  nombre: string = null;
  darDeBajaLoading: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.id = this.customOverlayRef.data.id;
    this.nombre = this.customOverlayRef.data.nombre;
  }

  darDeBajaOk(): void {
    this.darDeBajaLoading.set(true);
    this.ars
      .deleteArticulo(this.id)
      .subscribe((response: StatusResult): void => {
        if (response.status == 'ok') {
          this.dialog
            .alert({
              title: 'Éxito',
              content:
                'El artículo "' + this.nombre + '" ha sido dado de baja.',
              ok: 'Continuar',
            })
            .subscribe((): void => {
              this.customOverlayRef.close(true);
            });
        } else {
          this.dialog
            .alert({
              title: 'Error',
              content: '¡Ocurrió un error al dar de baja el artículo!',
              ok: 'Continuar',
            })
            .subscribe((): void => {
              this.darDeBajaLoading.set(false);
            });
        }
      });
  }
}
