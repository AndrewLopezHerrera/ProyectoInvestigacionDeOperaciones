import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReemplazoEquipos.css";
import IniciarSolucionadorReemplazoEquipos from "./SolucionadorReemplazoEquipos";
/** @typedef {import("./SolucionReemplazoEquipos").SolucionReemplazoEquipos} SolucionReemplazoEquipos */

const ReemplazoEquipos = () => {
  const navigate = useNavigate();
  const [tablaReventaMantenimiento, setTablaReventaMantenimiento] = useState([]);
  const [años, setAños] = useState(1);
  const [reventa, setReventa] = useState("");
  const [mantenimiento, setMantenimiento] = useState("");
  const [costoInicial, setCostoInicial] = useState("");
  const [vidaUtil, setVidaUtil] = useState("");
  const [tiempoPlanReemplazo, setTiempoPlanReemplazo] = useState("");

  const [ResultadosAlgoritmo, setResultadosAlgoritmo] = useState(null);

  const validarEntero = (valor, setValor) => {
    if(!valor) {
      setValor("");
      return;
    }
    const limpio = valor.replace(/[^0-9]/g, '');
    setValor(limpio);
  }

  const agregarFila = () => {
    if(reventa === "" || mantenimiento === ""){
      alert("Por favor, complete ambos campos de reventa y mantenimiento.");
      return;
    }
    setAños(años + 1);
    setTablaReventaMantenimiento([
      ...tablaReventaMantenimiento,
      { años, reventa, mantenimiento },
    ]);
  }

  const eliminarFila = (index) => {
    const nuevaTabla = tablaReventaMantenimiento.filter((_, i) => i !== index);
    nuevaTabla.forEach((fila, i) => {
      fila.años = i + 1;
    });
    setAños(nuevaTabla.length + 1);
    setTablaReventaMantenimiento(nuevaTabla);
  }

  const ejecutarAlgoritmo = () => {
    const resultados = IniciarSolucionadorReemplazoEquipos(
      parseInt(costoInicial),
      parseInt(vidaUtil),
      parseInt(tiempoPlanReemplazo),
      tablaReventaMantenimiento
    );
    setResultadosAlgoritmo(resultados);
  }

  return (
    <div className="MainContainer">
      <h1>Reemplazo de Equipos</h1>
      <div className="sectionInputInfo">
        <input
          className="menu-boton"
          placeholder="Costo inicial del equipo"
          type="number"

          onChange={(e) => validarEntero(e.target.value, setCostoInicial)}
          value={costoInicial}
        />
        <input
          className="menu-boton"
          placeholder="Vida útil (en años)"
          type="number"
          onChange={(e) => validarEntero(e.target.value, setVidaUtil)}
          value={vidaUtil}
        />
        <input
          className="menu-boton"
          placeholder="Tiempo del plan de reemplazo (en años)"
          type="number"
          onChange={(e) => validarEntero(e.target.value, setTiempoPlanReemplazo)}
          value={tiempoPlanReemplazo}
        />
        <button className="menu-boton" onClick={ejecutarAlgoritmo}>Ejecutar Algoritmo</button>
      </div>
      <div className="sectionInputAndTableResaleMaintenance">
        <div className="sectionInputInfo">
          <input
            className="menu-boton"
            type="number"
            placeholder="Reventa"
            onChange={(e) => validarEntero(e.target.value, setReventa)}
            value={reventa}
          />
          <input
            className="menu-boton"
            type="number"
            placeholder="Costo de mantenimiento"
            onChange={(e) => validarEntero(e.target.value, setMantenimiento)}
            value={mantenimiento}
          />
          <button className="menu-boton" onClick={agregarFila}>
            Agregar
          </button>
        </div>
        <div className="sectionTableResaleMaintenance">
          <h3>Tabla de Reventa y Mantenimiento</h3>
          <table className="tableResaleMaintenance">
            <thead>
              <tr>
                <th>Años</th>
                <th>Reventa</th>
                <th>Mantenimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tablaReventaMantenimiento.map((fila, index) => (
                <tr key={index}>
                  <td>{fila.años}</td>
                  <td>{fila.reventa}</td>
                  <td>{fila.mantenimiento}</td>
                  <td>
                    <button className="menu-boton" onClick={() => eliminarFila(index)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {ResultadosAlgoritmo && (
        <div>
          <h2>Resultados del Algoritmo</h2>
          {ResultadosAlgoritmo.soluciones.map((solucion, key) => (
            <div key={`solucion${solucion.numeroCaso}`}>
              <h3>{`G(${solucion.numeroCaso})`}</h3>
              <div>
                {solucion.operaciones.map((operacion, opKey) => (
                  <p>{`C${operacion.anioInicial}${operacion.anioFinal} + G${operacion.anioFinal} = ${operacion.costoAnioInicial} + G${operacion.costoAnioFinal} = ${operacion.resultado}`}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="menu-boton" onClick={() => navigate("/")}>
        Volver al Menú
      </button>
    </div>
  );
}

export default ReemplazoEquipos;