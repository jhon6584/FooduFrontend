export interface Pedido {
  clienteID?: number;
  nombre: string;
  celular: string;
  direccion: string;
  repartidor?: string;
  tiempoEstimado?: number;
  costoEnvio?: number;
  observacion?: string;
}