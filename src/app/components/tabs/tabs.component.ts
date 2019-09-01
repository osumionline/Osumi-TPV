import { Component, Input } from '@angular/core';
import { Tabs }             from '../../interfaces/interfaces';
import { DialogService }    from '../../services/dialog.service';

@Component({
  selector: 'otpv-tabs',
  templateUrl: './html/tabs.component.html',
  styleUrls: ['./css/tabs.component.css']
})
export class TabsComponent {
  @Input() tabs : Tabs = {
    selected: 0,
	names: []
  };
  @Input() showClose: boolean = false;

  constructor(private dialog: DialogService) {}
  
  selectTab(ind: number){
    this.tabs.selected = ind;
  }
  
  closeTab(ind: number){
    this.dialog.confirm({title: 'Confirmar', content: '¿Estás seguro de querer cerrar esta venta?', ok: 'Continuar', cancel: 'Cancelar'}).subscribe(result => {
      if (result===true){
        if (this.tabs.selected==ind){
          this.tabs.selected = 0;
		}
        this.tabs.names.splice(ind, 1);
	  }
	});
  }
}