/** @typedef {import("./OperacionG").OperacionG} OperacionG */
/** @typedef {import("./SolucionG").SolucionG} SolucionG */
/** @typedef {import("./SolucionReemplazoEquipos").SolucionReemplazoEquipos} SolucionReemplazoEquipos */
/** @typedef {import("./ElementoTablaPlan").ElementoTablaPlan} ElementoTablaPlan */

/** @type {Array<{años: number, reventa: number, mantenimiento: number}>} */
let TablaReventaMantenimiento = [];
/** @type {Map<string, SolucionG>} */
const Soluciones = new Map();
/** @type {Array<number>} */
let Costos = [];
/** @type {Array<number[]>} */
let PlanesReemplazo = [];

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
    Costos = [];
    CalcularCostos(costoInicial);
    Soluciones.clear();
    PlanesReemplazo = [];
    Soluciones.set(String(tiempoPlanReemplazo), {
        numeroCaso: tiempoPlanReemplazo,
        operaciones: [],
        operacionOptima: null,
        solucionOptima: 0
    });
    for(let anio = tiempoPlanReemplazo - 1; anio >= 0; anio--) {
        const solucion = CalcularCostosAnios(anio, vidaUtil, tiempoPlanReemplazo);
        Soluciones.set(String(anio), solucion);
    }
    /** @type {SolucionReemplazoEquipos} */
    const solucion = {
        soluciones: Soluciones,
        planesReemplazo: [],
        tablaPlan: CrearTablaPlanesReemplazo(tiempoPlanReemplazo)
    };
    solucion.planesReemplazo = CrearPlanesReemplazo(tiempoPlanReemplazo, solucion.tablaPlan);
    console.log(solucion);
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
 * Método que crea la tabla de planes de reemplazo basados en el tiempo del plan de reemplazo.
 * @param {number} tiempoPlanReemplazo La duración del plan de reemplazo.
 * @returns {ElementoTablaPlan[]} La tabla de planes de reemplazo generada.
 */
const CrearTablaPlanesReemplazo = (tiempoPlanReemplazo) => {
    const planes = [];
    for(let anio = 0; anio <= tiempoPlanReemplazo; anio++) {
        const solucion = Soluciones.get(String(anio));
        const elementoPlan = {
            anio,
            costo: solucion.solucionOptima,
            proximo: solucion.operaciones.map(op => solucion.solucionOptima === op.resultado ? op.anioFinal : null).filter(n => n !== null)
        };
        planes.push(elementoPlan);
    }
    return planes;
}

/**
 * Método que crea los planes de reemplazo basados en la vida útil.
 * @param {number} vidaUtil La vida útil del equipo.
 * @param {ElementoTablaPlan[]} tablaPlanes La tabla de planes de reemplazo.
 * @returns {number[][]} Los planes de reemplazo generados.
 */
const CrearPlanesReemplazo = (tiempoPlanReemplazo, tablaPlanes) => {
    GenerarPlanRecursivo(tablaPlanes, tiempoPlanReemplazo, [], 0);
    return PlanesReemplazo;
}

/**
 * 
 * @param {ElementoTablaPlan[]} tablaPlanes 
 * @param {number} vidaUtil 
 * @param {number[]} planActual 
 * @param {number} añoActual 
 * @returns 
 */
const GenerarPlanRecursivo = (tablaPlanes, tiempoPlanReemplazo, planActual, añoActual) => {
    if(tiempoPlanReemplazo == añoActual) {
        planActual.push(añoActual);
        PlanesReemplazo.push(planActual);
        return;
    }
    const elementoActual = tablaPlanes[añoActual];
    const proximosAnios = elementoActual.proximo;
    for(const proximo of proximosAnios) {
        const nuevoPlan = [...planActual];
        nuevoPlan.push(añoActual);
        GenerarPlanRecursivo(tablaPlanes, tiempoPlanReemplazo, nuevoPlan, proximo);
    }
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
    solucion.solucionOptima = operacionOptima.resultado;
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
        let costo = costoInicial - element.reventa;
        for(let i = 0; i < element.años; i++) {
            costo += TablaReventaMantenimiento[i].mantenimiento;
        }
        Costos.push(costo);
    });
}

export default IniciarSolucionadorReemplazoEquipos;