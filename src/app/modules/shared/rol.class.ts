export class RolGroup {
  constructor(
    public name: string,
    public roles: {
      [key: string]: Rol;
    } = {}
  ) {}
}

export class Rol {
  constructor(
    public id: number,
    public name: string,
    public description: string
  ) {}
}

export const rolList: {
  [key: string]: RolGroup;
} = {
  ventas: new RolGroup("Ventas", {
    modificarImportes: new Rol(
      1,
      "Modificar importes, descuentos o descuentos directos.",
      "Indica si un empleado puede modificar el importe directo de un artículo en una venta o si puede aplicar descuentos directos."
    ),
  }),
  marca: new RolGroup("Marcas", {
    crear: new Rol(
      2,
      "Crear nuevas marcas.",
      "Permite al empleado crear una nueva marca."
    ),
    modificar: new Rol(
      3,
      "Modificar datos de una marca.",
      "Permite al empleado modificar los datos de una marca como la foto, datos de contacto u observaciones."
    ),
    borrar: new Rol(
      4,
      "Borrar una marca",
      "Permite al empleado borrar una marca. No se borrarán los artículos de esa marca, pero todos los artículos de esa marca dejarán de estar disponibles para venta hasta que no se les asigne una marca nueva."
    ),
    estadisticas: new Rol(
      5,
      "Consultar estadísticas de una marca",
      "Permite al empleado consultar las estadísticas de ventas y reposiciones de artículos de una marca."
    ),
  }),
  proveedor: new RolGroup("Proveedores", {
    crear: new Rol(
      6,
      "Crear nuevos proveedores.",
      "Permite al empleado crear un nuevo proveedor."
    ),
    modificar: new Rol(
      7,
      "Modificar datos de un proveedor.",
      "Permite al empleado modificar los datos de un proveedor como la foto, datos de contacto u observaciones."
    ),
    borrar: new Rol(
      8,
      "Borrar un proveedor",
      "Permite al empleado borrar un proveedor. Las marcas asociadas al proveedor no se borrarán, pero si se borrarán sus comerciales asociados."
    ),
    estadisticas: new Rol(
      9,
      "Consultar estadísticas de un proveedor",
      "Permite al empleado consultar las estadísticas de ventas y reposiciones de artículos de un proveedor."
    ),
  }),
  articulos: new RolGroup("Artículos", {
    crear: new Rol(
      10,
      "Crear nuevos artículos.",
      "Permite al empleado crear un nuevo artículo."
    ),
    modificar: new Rol(
      11,
      "Modificar datos de un artículo.",
      "Permite al empleado modificar los datos de un artículo como sus precios, stocks, marca, proveedor..."
    ),
    borrar: new Rol(
      12,
      "Borrar un artículo",
      "Permite al empleado borrar un artículo. Las ventas asociadas al artículo no se borrarán, pero el artículo dejará de estar disponible para su venta."
    ),
    estadisticas: new Rol(
      13,
      "Consultar estadísticas de un artículo",
      "Permite al empleado consultar las estadísticas de ventas y reposiciones de un artículo."
    ),
    modificarObservaciones: new Rol(
      14,
      "Modificar observaciones de un artículo",
      "Permite al empleado modificar las observaciones de un artículo, asi como indicar cuando o donde deben mostrarse estas observaciones."
    ),
  }),
  clientes: new RolGroup("Clientes", {
    crear: new Rol(
      15,
      "Crear nuevos clientes.",
      "Permite al empleado crear un nuevo cliente."
    ),
    modificar: new Rol(
      16,
      "Modificar datos de un cliente.",
      "Permite al empleado modificar los datos de un cliente como su dirección, datos de contacto u observaciones."
    ),
    borrar: new Rol(
      17,
      "Borrar un cliente",
      "Permite al empleado borrar un cliente. Las ventas asociadas al cliente no se borrarán, pero dejarán de estar vinculadas a un cliente concreto."
    ),
  }),
  gestion: new RolGroup("Gestión", {
    modificarAjustesIniciales: new Rol(
      18,
      "Modificar ajustes generales de la aplicación.",
      "Permite al empleado modificar los ajustes generales de la aplicación como datos del negocio, IVAs a usar, márgenes de beneficio, datos de la tienda online..."
    ),
    tiposPago: new Rol(
      19,
      "Modificar tipos de pago.",
      "Permite al empleado modificar los tipos de pago de la aplicación."
    ),
  }),
  empleados: new RolGroup("Empleados", {
    crear: new Rol(
      20,
      "Crear nuevos empleados.",
      "Permite al empleado crear un nuevo empleado."
    ),
    modificar: new Rol(
      21,
      "Modificar datos de un empleado.",
      "Permite al empleado modificar los datos de un empleado como su nombre, contraseña o color."
    ),
    borrar: new Rol(
      22,
      "Borrar un empleado",
      "Permite al empleado borrar a otro empleado. Las ventas asociadas al empleado no se borrarán, pero dejarán de estar vinculadas a un empleado concreto."
    ),
    roles: new Rol(
      23,
      "Modificar permisos de un empleado",
      "Permite al empleado modificar los permisos que tienen los otros empleados. Esto les permitirá acceder a distintos apartados o realizar distintas acciones."
    ),
    estadisticas: new Rol(
      24,
      "Consultar estadísticas de un empleado",
      "Permite al empleado consultar sus estadísticas de ventas y las de otros empleados."
    ),
  }),
};
