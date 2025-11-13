import { OperacionG } from "./OperacionG";

interface SolucionG {
    numeroCaso: number;
    operaciones: OperacionG[];
    operacionOptima: OperacionG | null;
    solucionOptima: number;
}

export type { SolucionG };