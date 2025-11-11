import { SolucionG } from "./SolucionG";

interface SolucionReemplazoEquipos {
    soluciones: Map<string, SolucionG>;
    planesReemplazo: number[][];
}

export type { SolucionReemplazoEquipos };