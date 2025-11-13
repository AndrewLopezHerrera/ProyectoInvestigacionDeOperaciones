import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import "./ArbolesBinarios.css";

export default function ArbolesBinarios() {
  const navegar = useNavigate();

  // useState
  const [enTransicion, setEnTransicion] = useState(false);
  const [pantalla, setPantalla] = useState("inicio");
  const [cantidadClaves, setCantidadClaves] = useState(1);
  const [datos, setDatos] = useState([]);
  const [sumaValores, setSumaValores] = useState(0);

  const cambiarPantalla = (nueva) => {
    setEnTransicion(true);
    setTimeout(() => {
      setPantalla(nueva);
      setEnTransicion(false);
    }, 400);
  };

  const reiniciarModo = () => {
    setEnTransicion(true);
    setTimeout(() => {
      setPantalla("inicio")
      setEnTransicion(false);
    }, 400);
  };

  //Las entradas van a estar en datos, sumaValores y cantidadClaves
  const algoritmoArbolBinario = () =>{
    //Crear la tabla A 
    const tablaA = Array.from({ length: cantidadClaves }, () => Array(cantidadClaves).fill(-1));

    //Crear la tabla R con las mismas dimensiones de A
    const tablaR = Array.from({ length: cantidadClaves  }, () => Array(cantidadClaves).fill(-1));

    //Rellenar de ceros la diagonal 
    rellenarDiagonalCeros(tablaA);
    rellenarDiagonalCeros(tablaR);

    //Rellenar la diagonal de la matriz A con los valores de las claves y de la R con el valor de i +1
    for(let i = 0; i < datos.length; i++){
      const { clave, valor } = datos[i];
      tablaA[i][i+1] = valor; //Coloco el valor de la clave en su lugar correspondiente
      tablaR[i][i+1] = i+1; //Ese sería el valor de k
    }
    
    //Ciclo para rellenar la tabla A y R en las casillas que corresponde con el algoritmo
    for(let i = 0; i < cantidadClaves; i++){
      for(let j = i +2; j <= cantidadClaves; j++){
        tablaA[i][j] =  69
      }
    }

    console.table(tablaA)
    console.table(tablaR)

  };

  const encontrarMenor = (matrizA, matrizR, fila, columna) =>{
    const resultados = []
    let valor = 0
    let sumaClaves = 0
    //Sumar el valor fijo de las claves
    for(let i = fila + 1; i <= columna; i++){
      sumaClaves += datos[i].valor
    }

    //Iterar desde 1 hasta la columna 
    for(let i = 0; i <= columna; i++){
      valor = matrizA[fila][i-1] + matrizA[i+1][columna] + sumaClaves
      resultados.push(valor)
      valor = 0
    }

    //Elegir el menor y ponerlo en esa posición de la matriz
    



  }

  const rellenarDiagonalCeros = (matriz) => {
    for (let i = 0; i < matriz[0].length; i++) {
      matriz[i][i] = 0;
    }
    return matriz
  }

  const validarCantidadDeClaves = () => {
    if (cantidadClaves != "") {
      const numero = parseInt(cantidadClaves, 10);
      const texto = cantidadClaves.toString(); 

      if (isNaN(numero) || texto.includes(".") || texto.includes(",")) {
        alert("Error: Debe ingresar un número entero.");
        return;
      }

      if (numero < 1 || numero > 10) {
        alert("La cantidad de claves debe de ser un número entre 1 y 10.");
        return;
      }

      //Si pasa la cantidad de verificaciones paso a la otra pantalla y genero la matriz con los datos
      setDatos(Array.from({ length: numero }, () => ({ clave: "", valor: "" })));
      cambiarPantalla("tablaValores");
    }
  };

   const manejarIngresoDatosTabla = (index, campo, valor) => {
    const nuevosDatos = [...datos];
    nuevosDatos[index][campo] = valor;
    setDatos(nuevosDatos);

  };

  const validarClavesValores = () => {
    
    for (let i = 0; i < datos.length; i++) {
      const { clave, valor } = datos[i];

      //Validar que no queden vacíos
      if (clave.trim() === "" || valor === "") {
        alert(`Error: La fila ${i + 1} tiene un campo vacío.`);
        return;
      }

      //Validar que no haya negativos
      const numValor = parseFloat(valor);
      if (isNaN(numValor) || numValor < 0) {
        alert(`Error: El valor en la fila ${i + 1} debe ser un número mayor o igual a 0.`);
        return;
      }
      console.log("valor original: " + valor + " valor float: " + numValor )
      datos[i].valor = numValor;
    }

    //Pasa las verificaciones, ordeno los valores y les coloco su probabilidad
    calcularSumaValores(); //Sumo todos los pesos
    console.log("Suma valores:" + sumaValores)

    ordenarClaves(); //Ordeno las claves
    colocarProbabilidad(); //Con la suma de todos los pesos coloco la probabilidad

    algoritmoArbolBinario();
  };


  const ordenarClaves = () => {
  const datosOrdenados = [...datos]
    .map(obj => ({ ...obj })) // copia cada objeto
    .sort((a, b) => a.clave.localeCompare(b.clave));
  
  setDatos(datosOrdenados);
};

  const calcularSumaValores = () => {
    const suma = datos.reduce((total, fila) => total + Number(fila.valor), 0);
    setSumaValores(suma);
  };

  const colocarProbabilidad = () =>{
    datos.forEach((item) => {
      item.valor = item.valor / sumaValores;
      console.log("Item valor: " + item.valor + " dividido entre: " + sumaValores)
    });
  }

  return (
    <div className="App main-page">
      <div className={`fade-container ${enTransicion ? "fade-out" : "fade-in"}`}>
      {pantalla === "inicio" && (
      <div className="opcionesManualArchivo">
        <div>
          <h1>Árboles Binarios de Búsqueda</h1>
          <h2>¿Cómo deseas calcular?</h2>
          <button className="menu-boton" onClick={() => cambiarPantalla("claves")}>Calcular Ingresando Datos</button>
          <button className="menu-boton">Calcular Cargando Datos</button>
        </div>

        <div>
          <button className="menu-boton" onClick={() => navegar("/")}>
            Volver al Menú Principal
          </button>
        </div>
      </div>
    )}
    {pantalla == "claves" && (
        <div className="mode-selection">
          <h1>Ingresa la Cantidad de Claves</h1>
          <div className="cantidadClaves">
          <input
                    type="number"
                    step="1"
                    min="1"
                    max="10"
                    value={cantidadClaves}
                    onChange={(e) => setCantidadClaves(e.target.value)}
                  />
          </div>
           <button className="menu-boton" onClick={() => validarCantidadDeClaves()}>
            Continuar
          </button>
          <button className="menu-boton" onClick={() => cambiarPantalla("inicio")}>
            Volver al Menú Anterior
          </button>
        </div>
      )}

      {pantalla == "tablaValores" && (
        <div>
          <div>
            <h1>Ingrese las Claves y su Peso.</h1>
          </div>
          <div>
            <table>
            <thead>
              <tr>
                <th></th>
                <th>Clave</th>
                <th>Perso</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((fila, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      value={fila.clave}
                      onChange={(e) => manejarIngresoDatosTabla(index, "clave", e.target.value)}
                      style={{ width: "100px", textAlign: "center" }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={fila.valor}
                      onChange={(e) => manejarIngresoDatosTabla(index, "valor", e.target.value)}
                      style={{ width: "100px", textAlign: "center" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
          <div>
              <button className="menu-boton" onClick={() => validarClavesValores()}>
            Realizar Cálculos
          </button>
          <button className="menu-boton" onClick={() => cambiarPantalla("claves")}>
            Volver al Menú Anterior
          </button>
          </div>
      </div>
      )} 

      {pantalla === "menu" && (
        <button className="menu-boton" onClick={() => navegar("/")}>
          Volver al Menú Principal
        </button>
      )}
    </div>
  </div>
  );
}
