export default class FacturaItem {
  deployed: boolean = false;

  constructor(
    public concepto: string | null = null,
    public fecha: string | null = null,
    public precioIVA: number | null = null,
    public precioSinIVA: number | null = null,
    public unidades: number | null = null,
    public subtotal: number | null = null,
    public iva: number | null = null,
    public ivaImporte: number | null = null,
    public descuento: number | null = null,
    public total: number | null = null,
    public lineas: FacturaItem[] = []
  ) {}
}
