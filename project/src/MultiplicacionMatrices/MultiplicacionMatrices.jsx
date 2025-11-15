import { useState } from "react";
import SolucionarMultiplicacionMatrices from "./SolucionadorMultiplicacionMatrices";
import "./MultiplicacionMatrices.css";
import { useNavigate } from "react-router-dom";

const MultiplicacionMatrices = () => {
  const [tablaEntradas, setTablaEntradas] = useState([]);
  const [filas, setFilas] = useState("");
  const [columnas, setColumnas] = useState("");

  const [tablaCostos, setTablaCostos] = useState(null);
  const [iteracionesK, setIteracionesK] = useState(null);
  const [matrizGanadores, setMatrizGanadores] = useState(null);

  const navigate = useNavigate();

  const agregarFila = () => {
    if(tablaEntradas.length > 10){
      alert("Se ha alcanzado el número máximo de filas (10).");
      return;
    }
    if(filas === "" || columnas === ""){
      alert("Por favor, complete ambos campos de filas y columnas.");
      return;
    }
    const nuevaFila = {
        id: tablaEntradas.length + 1,
        filas,
        columnas
      };
    if(tablaEntradas.length != 0 && tablaEntradas[tablaEntradas.length - 1].columnas !== filas){
      alert("La altura de la nueva matriz debe coincidir con la anchura de la última matriz agregada.");
      return;
    }
    setTablaEntradas([...tablaEntradas, nuevaFila]);
    setFilas("");
    setColumnas("");
  };

  const eliminarFila = (index) => {
    const nuevaTabla = tablaEntradas.filter((_, i) => i > index);
    nuevaTabla.forEach((fila, i) => {
      fila.id = i + 1;
    });
    setTablaEntradas(nuevaTabla);
  };

  const DescargarProblemaEnJSON = () => {
    if(tablaEntradas.length === 0) {
      alert("Por favor, agregue al menos una matriz antes de descargar el problema.");
      return;
    }
    const problema = {
      tablas: tablaEntradas
    };
    const json = JSON.stringify(problema, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "problema_matrices.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const EjecutarAlgoritmo = () => {
    if(tablaEntradas.length < 2) {
      alert("Por favor, agregue al menos dos matrices antes de ejecutar el algoritmo.");
      return;
    }
    const solucion = SolucionarMultiplicacionMatrices(tablaEntradas);
    setTablaCostos(solucion.matrizSolucion);
    setIteracionesK(solucion.iteracionesK);
    setMatrizGanadores(solucion.matrizGanadores);
  };

  const CargarProblemaDeJSON = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if(!file) return;
    reader.onload = (e) => {
      try {
        const contenido = e.target.result;
        const problema = JSON.parse(contenido);
        setTablaEntradas(problema.tablas);
      } catch (error) {
        alert("Error al cargar el archivo JSON. Por favor, asegúrese de que el archivo tenga el formato correcto.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="MainContainer">
      <h1>Multiplicación de Matrices</h1>
      <div className="sectionInputInfo">
        <button className="menu-boton" onClick={DescargarProblemaEnJSON}>
          Descargar Problema en JSON
        </button>
        <input
          className="menu-boton"
          type="file"
          accept=".json"
          onChange={CargarProblemaDeJSON}
        />
      </div>
      <div className="sectionInputInfo">
        <input
          className="menu-boton"
          type="number"
          min={0}
          max={10}
          value={filas}
          placeholder="Filas"
          onChange={(e) => setFilas(e.target.value)}
        />
        <input
          className="menu-boton"
          type="number"
          min={0}
          max={10}
          value={columnas}
          placeholder="Columnas"
          onChange={(e) => setColumnas(e.target.value)}
        />
        <button className="menu-boton" onClick={agregarFila}>
          Agregar Dimensiones
        </button>
      </div>
      <div className="sectionInputInfo">
        <button
          className="menu-boton"
          onClick={EjecutarAlgoritmo}
        >
          Ejecutar Algoritmo
        </button>
      </div>
      <div className="tableInput">
        <h2>Dimensiones de las Matrices</h2>
        <table className="tablePlanesReemplazo">
          <thead>
            <tr>
              <th>ID</th>
              <th>Filas</th>
              <th>Columnas</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tablaEntradas.map((fila) => (
              <tr key={fila.id}>
                <td>{fila.id}</td>
                <td>{fila.filas}</td>
                <td>{fila.columnas}</td>
                <td><button className="buttonDeleteRow" onClick={() => eliminarFila(fila.id - 1)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {iteracionesK && (
      <div className="sectionResults">
        <h2>Iteraciones</h2>
        {iteracionesK.map((iteracion, index) => (
          <div key={index} className="">
            <h3>Para M[{iteracion.i}][{iteracion.j}]</h3>
            {iteracion.operaciones.map((operacion, opIndex) => (
              <div className={iteracion.costoActual !== operacion.costoMinimo ? "sectionIterationK" : "sectionIterationKSelected"} key={opIndex}>
                <h4>{`Tomando k = ${operacion.k}`}</h4>
                <p>
                  M[ {operacion.i} ][ {operacion.j} ] = 
                  M[ {operacion.i} ][ {operacion.k} ] + 
                  M[ {operacion.k + 1} ][ {operacion.j} ] + (
                  d<sub>{operacion.i - 1}</sub> * 
                  d<sub>{operacion.k}</sub> * 
                  d<sub>{iteracion.j}</sub>
                  ) = 
                  {operacion.costoUno} + {operacion.costoDos} + ({operacion.d_i} * {operacion.d_k} * {operacion.d_j}) = 
                  {operacion.costoMinimo}
                </p>
              </div>
            ))}
            <div className="separator"></div>
          </div>
        ))}
      </div>
      )}
      {tablaCostos && (
      <div className="sectionResults">
        <h2>Matriz de Costos Mínimos</h2>
        <table className="tableMultiplicacionMatrices">
          <thead>
            <tr>
              <th></th>
              {tablaCostos[0].map((_, colIndex) => (
                <th key={colIndex}>{colIndex + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tablaCostos.map((fila, rowIndex) => (
              <tr key={rowIndex}>
                <th>{rowIndex + 1}</th>
                {fila.map((valor, colIndex) => (
                  <td key={colIndex}>{valor == -1 ? "" : valor}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      {matrizGanadores && (
      <div className="sectionResults">
        <h2>Tabla P</h2>
        <table className="tableMultiplicacionMatrices">
          <thead>
            <tr>
              <th></th>
              {matrizGanadores[0].map((_, colIndex) => (
                <th key={colIndex}>{colIndex + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrizGanadores.map((fila, rowIndex) => (
              <tr key={rowIndex}>
                <th>{rowIndex + 1}</th>
                {fila.map((valor, colIndex) => (
                  <td key={colIndex}>{valor == -1 ? "" : valor}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      <button className="menu-boton" onClick={() => navigate("/")}>
        Volver al Menú
      </button>
    </div>
  );
}
export default MultiplicacionMatrices;