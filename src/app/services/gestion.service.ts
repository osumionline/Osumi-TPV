import { Injectable } from "@angular/core";
import { Empleado } from "src/app/model/empleado.model";

@Injectable({
  providedIn: "root",
})
export class GestionService {
  empleado: Empleado = null;

  constructor() {}
}
