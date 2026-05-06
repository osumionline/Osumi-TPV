import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';
import CategoriasService from '@app/services/categorias.service';
import Categoria from '@model/articulos/categoria.model';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'otpv-categorias',
  imports: [
    HeaderComponent,
    MatCard,
    MatCardContent,
    MatNavList,
    MatListItem,
    MatIcon,
    MatIconButton,
    MatTooltip,
    NgTemplateOutlet,
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss',
})
export default class CategoriasComponent {
  private readonly categoriasService: CategoriasService = inject(CategoriasService);

  categorias: WritableSignal<Categoria[]> = signal<Categoria[]>(this.categoriasService.categorias);
  selectedCategoria: WritableSignal<Categoria | null> = signal<Categoria | null>(null);

  toggleCategory(category: Categoria): void {
    category.deployed = !category.deployed;
  }

  selectCategory(category: Categoria): void {
    this.selectedCategoria.set(category);
  }

  addCategory(parent: Categoria): void {
    const newCategory = new Categoria(-1, 'Nueva Categoría', parent.profundidad + 1);
    parent.hijos.push(newCategory);
    parent.deployed = true;
  }

  editCategory(category: Categoria): void {
    const newName: string | null = prompt(
      'Editar nombre de la categoría:',
      category.nombre ?? undefined,
    );
    if (newName !== null) {
      category.nombre = newName;
    }
  }

  deleteCategory(category: Categoria): void {
    const index: number = this.categorias().findIndex(
      (cat: Categoria): boolean => cat === category,
    );
    if (index !== -1) {
      const updatedCategorias: Categoria[] = [...this.categorias()];
      updatedCategorias.splice(index, 1);
      this.categorias.set(updatedCategorias);
    } else {
      this.categorias().forEach((cat: Categoria): void =>
        this.deleteCategoryRecursive(cat, category),
      );
    }
  }

  private deleteCategoryRecursive(parent: Categoria, target: Categoria): void {
    const index: number = parent.hijos.findIndex((hijo: Categoria): boolean => hijo === target);
    if (index !== -1) {
      parent.hijos.splice(index, 1);
    } else {
      parent.hijos.forEach((hijo: Categoria): void => this.deleteCategoryRecursive(hijo, target));
    }
  }
}
