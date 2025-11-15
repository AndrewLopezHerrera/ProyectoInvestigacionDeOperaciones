import { OperacionCostoMinimo } from "./OperacionCostoMinimo";

interface IteracionK {
    i: number;
    j: number;
    costoActual: number;
    operaciones: OperacionCostoMinimo[];
}

export type { IteracionK };