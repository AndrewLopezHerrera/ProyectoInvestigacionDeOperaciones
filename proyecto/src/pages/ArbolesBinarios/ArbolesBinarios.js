import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import "./ArbolesBinarios.css";
import { number } from "framer-motion";
import { col, source } from "framer-motion/client";

export default function ArbolesBinarios() {
  const navegar = useNavigate();

  // useState
  const [enTransicion, setEnTransicion] = useState(false);
  const [pantalla, setPantalla] = useState("inicio");
  const [cantidadClaves, setCantidadClaves] = useState(1);
  const [datos, setDatos] = useState([]);
  const [sumaValores, setSumaValores] = useState(0);
  const [tablaA, setTablaA] = useState([])
  const [tablaR, setTablaR] = useState([])
  const [nodos, setNodos] = useState([])
  const [aristas, setAristas] = useState([])

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

  const guardarEnJson = () =>{
  const jsonString = JSON.stringify(datos, null, 2); // bien formateado

  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "ArbolBinario";
  link.click();

  URL.revokeObjectURL(url);
}


  const validarArchivo = (e) => {
  const archivo = e.target.files[0];

    if (!archivo) return;

    // Verificar que sea del tipo correct
    if (archivo.type !== "application/json") {
      alert("El archivo debe ser un JSON válido.");
      return;
    }

    const lector = new FileReader();

    lector.onload = (evento) => {
      try {
        const contenido = JSON.parse(evento.target.result);
        
        console.log("JSON leído:", contenido);

       
        if (!validarEstructura(contenido)) {
          alert("El archivo no tiene la estructura correcta.");
          //Mandar a la ventana anterior
          cambiarPantalla("inicio")
          return;
        }

        //Guardar los datos en la variable y acomodar todo para ejecutar el algoritmo
        setDatos(contenido);
        setCantidadClaves(contenido.length)
        alert("Archivo cargado correctamente.");
        
        //Pasar a la ventana donde se pueden modificar las claves
        setNodos([])
        setAristas([])
        cambiarPantalla("tablaValores")

      } catch (err) {
        alert("Error al leer el archivo JSON.");
        console.error(err);
      }
    };

    lector.readAsText(archivo);
  };


  const validarEstructura = (json) => {
  return (
    Array.isArray(json) &&
    json.every((item) => {
      if (!item || typeof item !== "object") return false;
      if (typeof item.clave !== "string" || item.clave.trim() === "") return false;
      const v = item.valor;
      if (typeof v !== "number") return false;
      if (!Number.isFinite(v)) return false; 
      if (v < 0) return false; 
      

      return true;
    })
  );
}


  //Las entradas van a estar en datos, sumaValores y cantidadClaves
  const algoritmoArbolBinario = () =>{
    //Crear la tabla A 
    const n = Number(cantidadClaves);
    console.log("n: " + n)
    let tablaA = Array.from({ length: n +1 }, () => Array(n + 1).fill(-1));

    //Crear la tabla R con las mismas dimensiones de A
    let tablaR = Array.from({ length: n + 1 }, () => Array(n +1).fill(-1));

    //Rellenar de ceros la diagonal 
    tablaA = rellenarDiagonalCeros(tablaA);
    tablaR = rellenarDiagonalCeros(tablaR);

    //Rellenar la diagonal de la matriz A con los valores de las claves y de la R con el valor de i +1
    for(let i = 0; i < datos.length; i++){
      const { clave, valor } = datos[i];
      tablaA[i][i+1] = valor; //Coloco el valor de la clave en su lugar correspondiente
      tablaR[i][i+1] = i+1; //Ese sería el valor de k
    }
    
    //Antes del ciclo
    console.log("Antes del ciclo: ")
       console.table(tablaA)
        console.table(tablaR)

    //Ciclo para rellenar la tabla A y R en las casillas que corresponde con el algoritmo
    //Primero un ciclo que termina cuando llegue a la última columna
    let fila = 0
    for(let col = 2; col < (n +1); col++){
      //Ciclo para rellenar de forma diagonal a partir de col hasta el final de las columnas
      for(let i = col; i < (n+1); i++){
        //Llamada a la función 
        encontrarMenor(tablaA, tablaR, fila, i)
  
        fila +=1 //Siempre aumento en 1 fila
      }
      //Reinicio la fila
      fila = 0

    }

    setTablaA([...tablaA]);
    setTablaR([...tablaR]);
    console.table(tablaA)
    console.table(tablaR)


    construirArbolB(tablaR, 0, (tablaA[0].length - 1), null, 400, 50, 350)
    setNodos([...nodos]);
    setAristas([...aristas]);
    cambiarPantalla("resultado")
    
    console.log(nodos)
    console.log(aristas)

  };



  //Nunca puedo ser [0][0]
  // fila = i
// columna = j
// padre = id de clave del padre (string) o null
const construirArbolB = (tablaR, fila, columna, padre, x, y, corrimiento) => {
  
  if (fila === columna) {
    return;
  } 

  let k = tablaR[fila][columna];   

  if (k === -1) {
    return;
  } 

  let idx = k - 1; 
  let clave = datos[idx].clave; 

  
  if (!nodos.some(n => n.id === clave)) {
    nodos.push({
      id: clave,
      position: { x, y },
      data: { label: clave },
      style: {
      padding: 4,         
      fontSize: "10px",   
      borderRadius: 4,
      border: "1px solid #888",
      background: "#d6eaff",
      width: 80,          
      height: 20        
    }
    });
  }

  
  if (padre !== null) {
    let edgeId = `${padre}-${clave}`;
    if (!aristas.some(e => e.id === edgeId)) {
      aristas.push({
        id: edgeId,
        source: padre,
        target: clave
      });
    }
  }

  // para el subarbol izquierdo
  construirArbolB(tablaR, fila, k - 1, clave, (x - corrimiento/2), (y+90), (corrimiento/2));

  // para el subarbol derecho
 construirArbolB(tablaR, k , columna, clave, (x + corrimiento/2), (y+90), (corrimiento/2));
};


  const encontrarMenor = (matrizA, matrizR, fila, columna) =>{
    const resultados = []

    let sumaClaves = 0
    //Sumar el valor fijo de las claves
    for(let i = fila  ; i < columna; i++){
      sumaClaves += datos[i].valor
      
    }

 

    //Iterar desde fila + 1 hasta la columna
    for(let i = fila +1; i <= columna; i++){
      //console.log("Fila: " + (fila+1) + " columna: " + columna + " k: " +i )
      //console.log("Suma claves: " +sumaClaves)
      //console.log("A[I][K-1] " +  matrizA[fila][i - 1])
      //console.log("A[k][j] " + matrizA[i][columna])
      resultados.push({k: i, valor: matrizA[fila][i-1] + matrizA[i][columna] + sumaClaves})
  
      
    }

    

    //Elegir el menor y ponerlo en esa posición de la matriz
    const menor = resultados.reduce((min, actual) =>
      actual.valor < min.valor ? actual : min
    );

    matrizA[fila][columna] = menor.valor 
    matrizR[fila][columna] = menor.k



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
      setNodos([])
      setAristas([])
      cambiarPantalla("tablaValores");
  
      //setCantidadClaves(number(cantidadClaves))
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
      
      datos[i].valor = numValor;
      console.log("Valor: " + numValor)
    }

    //Pasa las verificaciones, ordeno los valores y les coloco su probabilidad
    const suma = datos.reduce((total, fila) => total + Number(fila.valor), 0); //Sumo todos los pesos
    setSumaValores(suma)
 
    
    ordenarClaves(); //Ordeno las claves
    colocarProbabilidad(suma); //Con la suma de todos los pesos coloco la probabilidad
    
    algoritmoArbolBinario();
  };


  const ordenarClaves = () => {
  datos.sort((a, b) => a.clave.localeCompare(b.clave));
};

  const calcularSumaValores = () => {
    const suma = datos.reduce((total, fila) => total + Number(fila.valor), 0);
    setSumaValores(suma);
  };

  const colocarProbabilidad = (sumaTodos) =>{
    datos.forEach((item) => {
      item.valor = item.valor / sumaTodos;
      console.log(item.valor + " : " + sumaTodos)
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
          <button className="menu-boton" onClick={() => cambiarPantalla("cargarArchivo")}>Calcular Cargando Datos</button>
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
                <th>Peso</th>
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

      {pantalla == "cargarArchivo" &&(
        <div>
          <h1>Cargar Archivo</h1>
          <h2>Debe de cargar un archivo con extensión .json y el formato adecuado.</h2>
           <input type="file" accept=".json"   onChange={validarArchivo}/>
           <div>
          
          <button className="menu-boton" onClick={() => cambiarPantalla("opcionesManualArchivo")}>
            Volver al Menú Anterior
          </button>
          </div>
        </div>
      )}

      {pantalla == "resultado" &&(
        <div>
          <div className="tabla-contenedor">
            <h1>Resultados Tabla A</h1>
            <table className="tabla-matrizA">
            <thead>
              <tr>
                <th></th> 
                {tablaA[0].map((_, idx) => (
                  <th key={idx}>{idx} {idx > 0 && idx <= datos.length ? datos[idx - 1].clave : ""}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {tablaA.map((fila, i) => (
                <tr key={i}>
                  <th>{i + 1}</th>
                  {fila.map((valor, j) => (
                    <td key={j}>{valor === -1 ? "" : valor}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <div>
            <h1>Resultados Tabla R</h1>
            <table className="tabla-matrizR">
            <thead>
              <tr>
                <th></th>
                {tablaR[0].map((_, idx) => (
                  <th key={idx}>{idx}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {tablaR.map((fila, i) => (
                <tr key={i}>
                  <th>{i + 1}</th>
                  {fila.map((valor, j) => (
                    <td key={j}>{valor === -1 ? "" : valor}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <div style={{ width: "100%", height: "500px", border: "1px solid black" }}>
          <ReactFlow
            nodes={nodos}
            edges={aristas}
            fitView
            nodesConnectable={false}
            elementsSelectable={false}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
            <button className="menu-boton" onClick={() => cambiarPantalla("tablaValores")}>
            Volver al Menú Anterior
            </button>
            <button className="menu-boton" onClick={() => guardarEnJson()}>
            Guardar en Archivo JSON
            </button>
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
