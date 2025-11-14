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
  const [tiempoPlanReemplazo, setTiempoPlanReemplazo] = useState("");

  const [ResultadosAlgoritmo, setResultadosAlgoritmo] = useState(null);
  const [TablaPlanesReemplazo, setTablaPlanesReemplazo] = useState(null);
  const [PlanesReemplazo, setPlanesReemplazo] = useState(null);

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
      { años, reventa: Number(reventa), mantenimiento: Number(mantenimiento) },
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
      tablaReventaMantenimiento.length,
      parseInt(tiempoPlanReemplazo),
      tablaReventaMantenimiento
    );
    const listasSoluciones = [];
    for(let indice = tiempoPlanReemplazo; indice >= 0; indice--) {
      listasSoluciones.push(resultados.soluciones.get(String(indice)));
    }
    setResultadosAlgoritmo(listasSoluciones);
    setTablaPlanesReemplazo(resultados.tablaPlan);
    setPlanesReemplazo(resultados.planesReemplazo);
  }

  const DescargarProblemaEnJSON = () => {
    if(!costoInicial || !tiempoPlanReemplazo || tablaReventaMantenimiento.length === 0) {
      alert("Por favor, complete todos los campos antes de descargar el problema.");
      return;
    }
    const problema = {
      costoInicial: parseInt(costoInicial),
      tiempoPlanReemplazo: parseInt(tiempoPlanReemplazo),
      tablaReventaMantenimiento
    };
    const json = JSON.stringify(problema, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "problema_reemplazo_equipos.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  const CargarProblemaDeJSON = (event) => {
    const file = event.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const contenido = e.target.result;
        const problema = JSON.parse(contenido);
        setCostoInicial(problema.costoInicial.toString());
        setTiempoPlanReemplazo(problema.tiempoPlanReemplazo.toString());
        setTablaReventaMantenimiento(problema.tablaReventaMantenimiento);
        setAños(problema.tablaReventaMantenimiento.length + 1);
      } catch (error) {
        alert("Error al cargar el archivo JSON. Por favor, asegúrese de que el archivo tenga el formato correcto.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="MainContainer">
      <h1>Reemplazo de Equipos</h1>
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
          placeholder="Costo inicial del equipo"
          type="number"

          onChange={(e) => validarEntero(e.target.value, setCostoInicial)}
          value={costoInicial}
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
              {tablaReventaMantenimiento && tablaReventaMantenimiento.map((fila, index) => (
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
        <div className="tableResult">
          <h2>Resultados del Algoritmo</h2>
          {ResultadosAlgoritmo.map((solucion, key) => (
            <div key={`solucion${solucion.numeroCaso}`}>
              <h3>{`G(${solucion.numeroCaso}) = ${solucion.solucionOptima}`}</h3>
              <div>
                {solucion.operaciones.map((operacion, opKey) => (
                  <div className={solucion.solucionOptima === operacion.resultado ? "selectedResult" : ""} key={`operacion${operacion.anioInicial}${operacion.anioFinal}`}>{`C${operacion.anioInicial}${operacion.anioFinal} + G${operacion.anioFinal} = ${operacion.costoAnioInicial} + ${operacion.costoAnioFinal} = ${operacion.resultado}`}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {TablaPlanesReemplazo && (
        <div className="sectionTableResaleMaintenance">
          <h2>Planes de Reemplazo Óptimos</h2>
          <table className="tablePlanesReemplazo">
            <thead>
              <tr>
                <th>t</th>
                <th>G(t)</th>
                <th>Próximo</th>
              </tr>
            </thead>
            <tbody>
              {TablaPlanesReemplazo.map((plan, key) => (
                <tr key={`plan${key}`}>
                  <td>{plan.anio}</td>
                  <td>{plan.costo}</td>
                  <td>{plan.proximo.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {PlanesReemplazo && (
        <div className="sectionTableResaleMaintenance">
          <h2>Planes de Reemplazo Generados</h2>
          <table className="tablePlanesReemplazo">
            <thead>
              <tr>
                <th>Plan</th>
              </tr>
            </thead>
            <tbody>
              {PlanesReemplazo.map((plan, key) => (
                <tr key={`planGenerado${key}`}>
                  <td>{plan.join(" -> ")}</td>
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

export default ReemplazoEquipos;