/** @typedef {import("./Dimension").Dimension} Dimension */
/** @typedef {import("./OperacionCostoMinimo").OperacionCostoMinimo} OperacionCostoMinimo */
/** @typedef {import("./IteracionK").IteracionK} IteracionK */

/** @type {number[][]} */
let matrizSolucion = [];
/** @type {number[]} */
let dimensionesD = [];
/** @type {number[][]} */
let matrizGanadores = [];
/** @type {IteracionK[]} */
let iteracionesK = [];

/**
 * Soluciona el problema de la multiplicación de matrices utilizando programación dinámica
 * @param {Dimension[]} dimensiones Las dimensiones de las matrices a multiplicar
 * @returns {number[][]} La matriz de solución con los costos mínimos de multiplicación
 */
const SolucionarMultiplicacionMatrices = (dimensiones) => {
  const lado = dimensiones.length;
  CrearDimensionesD(dimensiones);
  CrearMatriz(lado);
  CalcularPrimerosNumeros(dimensiones, lado);
  SeleccionarDiagonales(lado);
  const resultado = {
    matrizSolucion,
    matrizGanadores,
    iteracionesK
  };
  return resultado;
}

/**
 * Crea el arreglo de los d a partir del arreglo de dimensiones
 * @param {Dimension[]} dimensiones Las dimensiones de las matrices a multiplicar
 */
const CrearDimensionesD = (dimensiones) => {
  dimensionesD = [];
  dimensionesD.push(dimensiones[0].filas);
  dimensiones.forEach(dimension => {
    dimensionesD.push(dimension.columnas);
  });
}

/**
 * Crea una matriz cuadrada de lado 'lado' e inicializa la diagonal principal en 0
 * @param {number} lado El tamaño de la matriz cuadrada
 */
const CrearMatriz = (lado) => {
  matrizSolucion = Array(lado);
  matrizGanadores = Array(lado);
  for(let i = 0; i < lado; i++) {
    matrizSolucion[i] = Array(lado).fill(-1);
    matrizGanadores[i] = Array(lado).fill(-1);
  }
  for(let i = 0; i < lado; i++) {
    matrizSolucion[i][i] = 0;
  }
}

/**
 * Calcula los primeros números de la matriz de solución
 * @param {Dimension[]} dimensiones Las dimensiones de las matrices a multiplicar
 * @param {number} lado El tamaño de la matriz cuadrada
 */
const CalcularPrimerosNumeros = (dimensiones, lado) => {
  let indiceFila = 0;
  let indiceColumna = 1;
  while(indiceFila < lado - 1) {
    const dimensionUno = dimensiones[indiceFila];
    const dimensionDos = dimensiones[indiceColumna];
    matrizSolucion[indiceFila][indiceColumna] = dimensionUno.filas * dimensionUno.columnas * dimensionDos.columnas;
    matrizGanadores[indiceFila][indiceColumna] = indiceColumna;
    indiceFila++;
    indiceColumna++;
  }

}

/**
 * Selecciona las diagonales de la matriz de solución para calcular los costos mínimos
 * @param {number} lado El tamaño de la matriz cuadrada
 * @param {Dimension[]} dimensiones Las dimensiones de las matrices a multiplicar
 */
const SeleccionarDiagonales = (lado) => {
  for(let j = 2; j < lado; j++) {
    IterarSobreDiagonal(lado, 0, j);
  }
}

/**
 * Itera sobre una diagonal específica de la matriz de solución
 * @param {number} lado El tamaño de la matriz cuadrada
 * @param {number} filaInicio La fila inicial de la diagonal
 * @param {number} columnaInicio La columna inicial de la diagonal
 * @param {Dimension[]} dimensiones Las dimensiones de las matrices a multiplicar
 */
const IterarSobreDiagonal = (lado, filaInicio, columnaInicio) => {
  while(columnaInicio < lado) {
    const costoMinimo = IterarCadaK(filaInicio, columnaInicio);
    matrizSolucion[filaInicio][columnaInicio] = costoMinimo;
    filaInicio++;
    columnaInicio++;
  }
}

/**
 * Itera sobre cada posible k para calcular el costo mínimo
 * @param { Dimension[] } dimensiones Las dimensiones de las matrices a multiplicar
 * @param { number } i La posicion i sobre la matriz de solucion
 * @param { number } j La posicion j sobre la matriz de solucion
 * @returns { number } El costo minimo encontrado
 */
const IterarCadaK = (i, j) => {
  const costosParaK = [];
  const iteracionK = { 
    i: i + 1, 
    j: j + 1,
    costoActual: 0,
    operaciones: []
  };
  for(let k = i; k < j; k++) {
    const operacion = CalcularCostoParaCadaK(i, j, k);
    costosParaK.push(operacion.costoMinimo);
    iteracionK.operaciones.push(operacion);
  }
  const indiceMinimo = costosParaK.indexOf(Math.min(...costosParaK));
  console.log(indiceMinimo, iteracionK.operaciones.length);
  matrizGanadores[i][j] = iteracionK.operaciones[indiceMinimo].k;
  iteracionK.costoActual = Math.min(...costosParaK);
  iteracionesK.push(iteracionK);
  return Math.min(...costosParaK);
}

/**
 * Calcula el costo para un k específico
 * @param {Dimension[]} dimensiones Las dimensiones de las matrices a multiplicar
 * @param {number} i La posicion i sobre la matriz de solucion
 * @param {number} j La posicion j sobre la matriz de solucion
 * @param {number} k La posicion k para dividir la multiplicacion
 * @returns {OperacionCostoMinimo} El costo calculado para el k especifico
 */
const CalcularCostoParaCadaK = (i, j, k) => {
  const costoUno = matrizSolucion[i][k];
  const costoDos = matrizSolucion[k + 1][j];
  const dimensionUno = dimensionesD[i];
  const dimensionMedio = dimensionesD[j + 1];
  const dimensionDos = dimensionesD[k + 1];
  const costoMultiplicacion = dimensionUno * dimensionMedio * dimensionDos;
  const costoTotal = costoUno + costoDos + costoMultiplicacion;
  const operacionCostoMinimo = {
    i: i + 1,
    j: j + 1,
    k: k + 1,
    costoUno,
    costoDos,
    d_i: dimensionUno,
    d_j: dimensionMedio,
    d_k: dimensionDos,
    costoMinimo: costoTotal
  };
  return operacionCostoMinimo;
}

export default SolucionarMultiplicacionMatrices;