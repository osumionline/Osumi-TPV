import { Provider } from '@angular/core';
import ApiService from '@services/api.service';
import ArticulosService from '@services/articulos.service';
import CaducidadesService from '@services/caducidades.service';
import CategoriasService from '@services/categorias.service';
import ClassMapperService from '@services/class-mapper.service';
import ClientesService from '@services/clientes.service';
import ComprasService from '@services/compras.service';
import ConfigService from '@services/config.service';
import EmpleadosService from '@services/empleados.service';
import GestionService from '@services/gestion.service';
import InformesService from '@services/informes.service';
import MarcasService from '@services/marcas.service';
import ProveedoresService from '@services/proveedores.service';
import VentasService from '@services/ventas.service';

function provideCore(): Provider[] {
  return [
    ApiService,
    ArticulosService,
    CaducidadesService,
    CategoriasService,
    ClassMapperService,
    ClientesService,
    ComprasService,
    ConfigService,
    EmpleadosService,
    GestionService,
    InformesService,
    MarcasService,
    ProveedoresService,
    VentasService,
  ];
}

export default provideCore;
