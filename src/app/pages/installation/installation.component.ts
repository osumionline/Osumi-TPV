import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DialogService }     from 'src/app/services/dialog.service';
import { ApiService }        from 'src/app/services/api.service';
import { AppDataInterface }  from 'src/app/interfaces/interfaces';

@Component({
	selector: 'otpv-installation',
	templateUrl: './installation.component.html',
	styleUrls: ['./installation.component.scss']
})
export class InstallationComponent implements OnInit {
	ivareOptions = [{id: 'iva', name: 'IVA'}, {id: 're', name: 'IVA + Recargo de equivalencia'}];
	ivaOptionsList = [{option: 4, selected: false}, {option: 10, selected: false}, {option: 21, selected: false}];
	reOptionsList: number[] = [0.5, 1.4, 5.2];

	optionsList: number[] = [];
	selectedIvaList: number[] = [];
	selectedReList: number[] = [];

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
	ngOnInit() {}

	checkIva(ev: MatCheckboxChange, i: number): void {
		if (ev.checked) {
			this.optionsList.push(i);
		}
		else {
			const ind = this.optionsList.findIndex(x => x === i);
			this.optionsList.splice(ind, 1);
		}
		this.optionsList.sort((a, b) => a - b);
	}

	selectAllIvas(): void {
		for (let i in this.ivaOptionsList) {
			this.ivaOptionsList[i].selected = true;
			this.optionsList.push(parseInt(i));
		}
	}

	selectNoneIvas(): void {
		this.optionsList = [];
		for (let i in this.ivaOptionsList) {
			this.ivaOptionsList[i].selected = false;
		}
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
		if (this.optionsList.length==0) {
			this.dialog.alert({title: 'Error', content: '¡No has elegido ningún valor en la lista de IVA/Recargo de equivalencias!', ok: 'Continuar'}).subscribe(result => {});
			return;
		}
		for (let option of this.optionsList) {
			this.selectedIvaList.push(this.ivaOptionsList[option].option);
			if (this.selectedOption === 're') {
				this.selectedReList.push(this.reOptionsList[option]);
			}
		}

		const selectedMargins = this.marginList.filter(x => x.checked).map(v => v.value);
		if (selectedMargins.length==0) {
			this.dialog.alert({title: 'Error', content: '¡No has elegido ningún valor en la lista de margenes de beneficio!', ok: 'Continuar'}).subscribe(result => {});
			return;
		}

		const data: AppDataInterface = {
			tipoIva: this.selectedOption,
			ivaList: this.selectedIvaList,
			reList: this.selectedReList,
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
	}
}
