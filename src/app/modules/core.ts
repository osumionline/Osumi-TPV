import { Provider } from '@angular/core';
import ApiService from '@services/api.service';
import ArticulosService from '@services/articulos.service';
import CategoriasService from '@services/categorias.service';
import ClassMapperService from '@services/class-mapper.service';
import ClientesService from '@services/clientes.service';
import ComprasService from '@services/compras.service';
import ConfigService from '@services/config.service';
import DialogService from '@services/dialog.service';
import EmpleadosService from '@services/empleados.service';
import GestionService from '@services/gestion.service';
import InformesService from '@services/informes.service';
import MarcasService from '@services/marcas.service';
import OverlayService from '@services/overlay.service';
import ProveedoresService from '@services/proveedores.service';
import VentasService from '@services/ventas.service';

function provideCore(): Provider[] {
  return [
    ConfigService,
    ApiService,
    DialogService,
    CategoriasService,
    ClassMapperService,
    MarcasService,
    ProveedoresService,
    VentasService,
    ArticulosService,
    ClientesService,
    EmpleadosService,
    GestionService,
    ComprasService,
    OverlayService,
    InformesService,
  ];
}

export default provideCore;
