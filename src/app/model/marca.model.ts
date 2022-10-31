import { MarcaInterface } from "src/app/interfaces/interfaces";
import { Utils } from "src/app/shared/utils.class";

export class Marca {
  constructor(
    public id: number = null,
    public nombre: string = "",
    public direccion: string = "",
    public idFoto: number = null,
    public telefono: string = "",
    public email: string = "",
    public web: string = "",
    public observaciones: string = ""
  ) {}

  fromInterface(m: MarcaInterface): Marca {
    this.id = m.id;
    this.nombre = Utils.urldecode(m.nombre);
    this.direccion = Utils.urldecode(m.direccion);
    this.idFoto = m.idFoto;
    this.telefono = Utils.urldecode(m.telefono);
    this.email = Utils.urldecode(m.email);
    this.web = Utils.urldecode(m.web);
    this.observaciones = Utils.urldecode(m.observaciones);

    return this;
  }

  toInterface(): MarcaInterface {
    return {
      id: this.id,
      nombre: Utils.urlencode(this.nombre),
      direccion: Utils.urlencode(this.direccion),
      idFoto: this.idFoto,
      telefono: Utils.urlencode(this.telefono),
      email: Utils.urlencode(this.email),
      web: Utils.urlencode(this.web),
      observaciones: Utils.urlencode(this.observaciones),
    };
  }
}
