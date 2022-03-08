import { Component, OnInit, Input } from '@angular/core';
import { ConfigService }            from 'src/app/services/config.service';

@Component({
	selector: 'otpv-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	@Input() selectedOption: string = '';

	constructor(public cs: ConfigService) {}

	ngOnInit(): void {}
}
