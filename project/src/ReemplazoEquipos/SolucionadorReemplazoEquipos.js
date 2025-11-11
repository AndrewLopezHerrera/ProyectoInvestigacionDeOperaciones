/** @typedef {import("./OperacionG").OperacionG} OperacionG */
/** @typedef {import("./SolucionG").SolucionG} SolucionG */
/** @typedef {import("./SolucionReemplazoEquipos").SolucionReemplazoEquipos} SolucionReemplazoEquipos */

/** @type {Array<{años: number, reventa: number, mantenimiento: number}>} */
let TablaReventaMantenimiento = [];
/** @type {Map<string, SolucionG>} */
const Soluciones = new Map();
/** @type {Array<number>} */
const Costos = [];

/**
 * Método que inicia el solucionador del problema de reemplazo de equipos.
 * @param {number} costoInicial 
 * @param {number} vidaUtil 
 * @param {number} tiempoPlanReemplazo 
 * @param {Array<{años: number, reventa: number, mantenimiento: number}>} tablaReventaMantenimiento 
 * @returns {SolucionReemplazoEquipos}
 */
const IniciarSolucionadorReemplazoEquipos = (costoInicial, vidaUtil, tiempoPlanReemplazo, tablaReventaMantenimiento) => {
    TablaReventaMantenimiento = tablaReventaMantenimiento;
    CalcularCostos(costoInicial);
    Soluciones.clear();
    Soluciones.set(String(0), {
        numeroCaso: 0,
        operaciones: [],
        operacionOptima: null,
        solucionOptima: 0
    });
    for(let anio = tiempoPlanReemplazo; anio >= 0; anio--) {
        const solucion = CalcularCostosAnios(anio, vidaUtil, tiempoPlanReemplazo);
        Soluciones.set(String(anio), solucion);
    }
    /** @type {SolucionReemplazoEquipos} */
    const solucion = {
        soluciones: Soluciones,
        planesReemplazo: []
    };
    return solucion;
}

/**
 * Método que calcula los costos para un rango de años.
 * @param {number} anioInicial 
 * @param {number} vidaUtil 
 * @returns {SolucionG}
 */
const CalcularCostosAnios = (anioInicial, vidaUtil, tiempoPlanReemplazo) => {
    const operaciones = [];
    for(let anioFinal = anioInicial + 1; anioFinal <= tiempoPlanReemplazo && anioFinal <= anioInicial + vidaUtil; anioFinal++) {
        const costoOperacion = CalcularCostoOperacionG(anioInicial, anioFinal);
        operaciones.push(costoOperacion);
    }
    /** @type {SolucionG} */
    const solucion = {
        numeroCaso: anioInicial,
        operaciones,
        operacionOptima: null,
        solucionOptima: 0
    };
    EncontrarOperacionOptima(solucion);
    return solucion;
}

/**
 * Método que encuentra la operación óptima dentro de una solución.
 * @param {SolucionG} solucion 
 */
const EncontrarOperacionOptima = (solucion) => {
    let operacionOptima = solucion.operaciones[0];
    for (const operacion of solucion.operaciones) {
        if (operacion.resultado < operacionOptima.resultado) {
            operacionOptima = operacion;
        }
    }
    solucion.operacionOptima = operacionOptima;
}

/**
 * Método que calcula el costo de una operación G (Costo entre un par de años).
 * @param {number} anioInicial 
 * @param {number} anioFinal 
 * @returns {OperacionG}
 */
const CalcularCostoOperacionG = (anioInicial, anioFinal) => {
    const costoAnioInicial = Costos[anioFinal - anioInicial - 1];
    const costoAnioFinal = Soluciones.get(String(anioFinal)).solucionOptima;
    const resultado = costoAnioInicial + costoAnioFinal;
    return {
        anioInicial,
        anioFinal,
        costoAnioInicial,
        costoAnioFinal,
        resultado
    };
}

/**
 * Calcula los costos para cada año basado en el costo inicial.
 * @param {number} costoInicial 
 */
const CalcularCostos = (costoInicial) => {
    TablaReventaMantenimiento.forEach(element => {
        let costo = costoInicial + element.mantenimiento - element.reventa;
        for(let i = 0; i < element.años; i++) {
            let mantenimiento = TablaReventaMantenimiento[i].mantenimiento;
            costo += mantenimiento;
        }
        Costos.push(costo);
    });
}

export default IniciarSolucionadorReemplazoEquipos;