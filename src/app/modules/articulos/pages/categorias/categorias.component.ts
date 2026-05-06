import { Component, inject, OnInit } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import CategoriasService from '@app/services/categorias.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'otpv-categorias',
  imports: [HeaderComponent, MatCard, MatCardContent],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss',
})
export default class CategoriasComponent implements OnInit {
  private readonly categoriasService: CategoriasService = inject(CategoriasService);

  ngOnInit(): void {
    console.log(this.categoriasService.categoriasPlain);
  }
}
