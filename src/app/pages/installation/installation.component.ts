import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { DialogService }     from '../../services/dialog.service';
import { ApiService }        from '../../services/api.service';
import { AppData }           from '../../interfaces/interfaces';

@Component({
	selector: 'otpv-installation',
	templateUrl: './installation.component.html',
	styleUrls: ['./installation.component.scss']
})
export class InstallationComponent implements OnInit {
	ivareOptions = [{id: 'iva', name: 'IVA'}, {id: 're', name: 'Recargo de equivalencia'}];
	ivaOptionsList: number[] = [4, 10, 21];
	reOptionsList: number[] = [4.5, 11.4, 26.2];

	optionsList: number[] = [];
	selectedOptionsList: number[] = [];

	selectedOption: string = 'iva';
	selectedOptionInList: number = null;

	marginList = [
		{value: 20,  checked: false},
		{value: 25,  checked: false},
		{value: 30,  checked: false},
		{value: 35,  checked: false},
		{value: 40,  checked: false},
		{value: 45,  checked: false},
		{value: 50,  checked: false},
		{value: 55,  checked: false},
		{value: 60,  checked: false},
		{value: 65,  checked: false},
		{value: 70,  checked: false},
		{value: 75,  checked: false},
		{value: 80,  checked: false},
		{value: 85,  checked: false},
		{value: 90,  checked: false},
		{value: 95,  checked: false},
		{value: 100, checked: false}
	];

	hasOnline: string = '0';
	hasExpiryDate: string = '0';

	constructor(private dialog: DialogService, private as: ApiService, private router: Router) {}
	ngOnInit() {
		this.optionsList = [...this.ivaOptionsList];
	}

	changeOptionList(id: string): void {
		this.selectedOption = id;
		this.selectedOptionsList = [];
		this.selectedOptionInList = null;

		if (id==='iva') {
			this.optionsList = [...this.ivaOptionsList];
		}
		if (id==='re') {
			this.optionsList = [...this.reOptionsList];
		}
	}

	selectOption(item: number): void {
		if (this.selectedOptionInList!=item) {
			this.selectedOptionInList = item;
		}
		else {
			this.selectedOptionInList = null;
		}
	}

	addToList(): void {
		const ind: number = this.optionsList.findIndex(x => x==this.selectedOptionInList);
		if (ind==-1) {
			return;
		}
		this.selectedOptionsList.push(this.selectedOptionInList);
		this.optionsList.splice(ind, 1);
		this.selectedOptionInList = null;
	}

	removeFromList(): void {
		const ind: number = this.selectedOptionsList.findIndex(x => x==this.selectedOptionInList);
		if (ind==-1) {
			return;
		}
		this.optionsList.push(this.selectedOptionInList);
		this.selectedOptionsList.splice(ind, 1);
		this.selectedOptionInList = null;
	}

	selectAllMargins(): void {
		for (let i in this.marginList) {
			this.marginList[i].checked = true;
		}
	}

	selectNoneMargins(): void {
		for (let i in this.marginList) {
			this.marginList[i].checked = false;
		}
	}

	saveConfiguration(): void {
		if (this.selectedOptionsList.length==0) {
			this.dialog.alert({title: 'Error', content: '¡No has elegido ningún valor en la lista de IVA/Recargo de equivalencias!', ok: 'Continuar'}).subscribe(result => {});
			return;
		}

		const selectedMargins = this.marginList.filter(x => x.checked).map(v => v.value);
		if (selectedMargins.length==0) {
			this.dialog.alert({title: 'Error', content: '¡No has elegido ningún valor en la lista de margenes de beneficio!', ok: 'Continuar'}).subscribe(result => {});
			return;
		}

		const data: AppData = {
			tipoIva: this.selectedOption,
			ivaList: this.selectedOptionsList,
			marginList: selectedMargins,
			ventaOnline: (this.hasOnline=='1'),
			fechaCad: (this.hasExpiryDate=='1')
		};

		this.as.saveInstallation(data).subscribe(result => {
			if (result.status==='ok') {
				this.dialog.alert({title: 'Información', content: 'Los datos han sido guardados, puedes continuar con la aplicación. ', ok: 'Continuar'}).subscribe(result => {
					this.router.navigate(['/']);
				});
			}
			else {
				this.dialog.alert({title: 'Error', content: '¡Ocurrió un error al guardar los datos!', ok: 'Continuar'}).subscribe(result => {});
				return false;
			}
		});

		console.log(data);
	}
}
