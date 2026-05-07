import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';
import { StatusResult } from '@interfaces/interfaces';
import Categoria from '@model/articulos/categoria.model';
import CategoriaDetalleComponent from '@modules/articulos/components/categoria-detalle/categoria-detalle.component';
import { DialogField, DialogService } from '@osumi/angular-tools';
import CategoriasService from '@services/categorias.service';
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
    CategoriaDetalleComponent,
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss',
})
export default class CategoriasComponent {
  private readonly cs: CategoriasService = inject(CategoriasService);
  private dialog: DialogService = inject(DialogService);

  categorias: WritableSignal<Categoria[]> = signal<Categoria[]>(this.cs.categorias);
  selectedCategoria: WritableSignal<Categoria | null> = signal<Categoria | null>(null);

  private updateTree(categories: Categoria[], updater: (cat: Categoria) => Categoria): Categoria[] {
    return categories.map((cat: Categoria): Categoria => {
      const updatedChildren: Categoria[] = this.updateTree(cat.hijos, updater);
      const updated: Categoria = updater(cat);

      const newCat = new Categoria(
        updated.id,
        updated.idPadre,
        updated.nombre,
        updated.profundidad,
        updatedChildren,
      );

      newCat.deployed = updated.deployed;

      return newCat;
    });
  }

  private updateDepthRecursive(
    category: Categoria,
    newParentId: number | null,
    newDepth: number,
  ): Categoria {
    const updatedChildren: Categoria[] = category.hijos.map(
      (child: Categoria): Categoria => this.updateDepthRecursive(child, category.id, newDepth + 1),
    );

    const newCat = new Categoria(
      category.id,
      newParentId,
      category.nombre,
      newDepth,
      updatedChildren,
    );

    newCat.deployed = category.deployed;

    return newCat;
  }

  private removeAndPromoteFromTree(
    categories: Categoria[],
    target: Categoria,
    parent: Categoria | null = null,
  ): Categoria[] {
    const result: Categoria[] = [];

    for (const cat of categories) {
      if (cat.id === target.id) {
        for (const child of cat.hijos) {
          const promoted: Categoria = this.updateDepthRecursive(
            child,
            parent ? parent.id : null,
            parent ? parent.profundidad + 1 : 0,
          );

          result.push(promoted);
        }
        continue;
      }

      const updatedChildren: Categoria[] = this.removeAndPromoteFromTree(cat.hijos, target, cat);

      const newCat = new Categoria(
        cat.id,
        cat.idPadre,
        cat.nombre,
        cat.profundidad,
        updatedChildren,
      );

      newCat.deployed = cat.deployed;

      result.push(newCat);
    }

    return result;
  }

  private findCategory(categories: Categoria[], id: number): Categoria | null {
    for (const category of categories) {
      if (category.id === id) {
        return category;
      }

      if (category.hijos.length > 0) {
        const found: Categoria | null = this.findCategory(category.hijos, id);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  toggleCategory(category: Categoria): void {
    const updated: Categoria[] = this.updateTree(this.categorias(), (cat: Categoria): Categoria => {
      if (cat.id === category.id) {
        const newCat = new Categoria(cat.id, cat.idPadre, cat.nombre, cat.profundidad, cat.hijos);

        newCat.deployed = !cat.deployed;
        return newCat;
      }

      return cat;
    });

    this.categorias.set(updated);
  }

  selectCategory(category: Categoria): void {
    if (category.id === 0) {
      return;
    }

    this.selectedCategoria.set(category);
  }

  addCategory(parent: Categoria): void {
    const updated: Categoria[] = this.updateTree(this.categorias(), (cat: Categoria): Categoria => {
      if (cat.id === parent.id) {
        const newChild = new Categoria(-1, cat.id, 'Nueva Categoría', cat.profundidad + 1, []);

        const newCat = new Categoria(cat.id, cat.idPadre, cat.nombre, cat.profundidad, [
          ...cat.hijos,
          newChild,
        ]);

        newCat.deployed = true;
        return newCat;
      }

      return cat;
    });

    this.categorias.set(updated);
  }

  editCategory(categoryId: number): void {
    const categorias: Categoria[] = this.categorias();
    const category: Categoria | null = this.findCategory(categorias, categoryId);

    if (!category) {
      console.error('Categoría no encontrada');
      return;
    }

    this.dialog
      .form({
        title: 'Categoría',
        content: 'Introduce el nombre de la categoría',
        fields: [
          {
            title: 'Nombre',
            type: 'text',
            value: category.nombre ?? '',
            required: true,
          },
        ],
      })
      .subscribe((result: DialogField[]): void => {
        if (result !== undefined && result.length > 0) {
          const newName: string = result[0].value;

          this.cs
            .saveCategoria(category.toInterface())
            .subscribe((saveResult: StatusResult): void => {
              if (saveResult.status !== 'ok') {
                this.dialog.alert({
                  title: 'Error',
                  content: 'Error al guardar la categoría',
                });
                return;
              }

              const updated: Categoria[] = this.updateTree(
                this.categorias(),
                (cat: Categoria): Categoria => {
                  if (cat.id === categoryId) {
                    const newCat = new Categoria(
                      cat.id,
                      cat.idPadre,
                      newName,
                      cat.profundidad,
                      cat.hijos,
                    );

                    newCat.deployed = cat.deployed;
                    return newCat;
                  }

                  return cat;
                },
              );

              this.categorias.set(updated);
            });
        }
      });
  }

  deleteCategory(category: Categoria): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content: `¿Estás seguro de que quieres eliminar la categoría "${category.nombre}"?`,
      })
      .subscribe((result: boolean): void => {
        if (result) {
          this.cs.deleteCategoria(category.id).subscribe((deleteResult: StatusResult): void => {
            if (deleteResult.status !== 'ok') {
              this.dialog.alert({
                title: 'Error',
                content: 'Error al eliminar la categoría',
              });
              return;
            }

            const updated: Categoria[] = this.removeAndPromoteFromTree(this.categorias(), category);

            this.categorias.set(updated);
          });
        }
      });
  }
}
