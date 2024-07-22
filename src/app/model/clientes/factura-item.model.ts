export default class FacturaItem {
  deployed: boolean = false;

  constructor(
    public concepto: string = null,
    public fecha: string = null,
    public precioIVA: number = null,
    public precioSinIVA: number = null,
    public unidades: number = null,
    public subtotal: number = null,
    public iva: number = null,
    public ivaImporte: number = null,
    public descuento: number = null,
    public total: number = null,
    public lineas: FacturaItem[] = []
  ) {}
}
