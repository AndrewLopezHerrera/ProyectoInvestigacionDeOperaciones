import { SolucionG } from "./SolucionG";
import { ElementoTablaPlan } from "./ElementoTablaPlan";

interface SolucionReemplazoEquipos {
    soluciones: Map<string, SolucionG>;
    planesReemplazo: number[][];
    tablaPlan: ElementoTablaPlan[];
}

export type { SolucionReemplazoEquipos };