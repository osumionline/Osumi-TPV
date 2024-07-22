import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Router } from '@angular/router';
import { StatusResult } from '@interfaces/interfaces';
import ApiService from '@services/api.service';
import ConfigService from '@services/config.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  standalone: true,
  selector: 'otpv-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [HeaderComponent, MatCard, MatCardContent, MatButton],
})
export default class MainComponent implements OnInit {
  private as: ApiService = inject(ApiService);
  private config: ConfigService = inject(ConfigService);
  private router: Router = inject(Router);

  title: string = '';
  loading: boolean = true;
  isOpened: boolean = false;

  ngOnInit(): void {
    if (this.config.status === 'install') {
      this.router.navigate(['/gestion/installation']);
    }
    if (this.config.status === 'loaded') {
      this.title = this.config.nombre;
      this.isOpened = this.config.isOpened;
      if (this.isOpened) {
        this.router.navigate(['/ventas']);
      }
      this.loading = false;
    }
  }

  openBox(): void {
    this.as.openBox().subscribe((result: StatusResult): void => {
      if (result.status === 'ok') {
        this.isOpened = true;
        this.config.isOpened = true;
        this.router.navigate(['/ventas']);
      }
    });
  }
}
