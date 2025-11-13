import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./SeriesDeportivas.css";

export default function SeriesDeportivas() {
  const navegar = useNavigate();

  // Estados iniciales
  const estadoInicial = {
    modo: null,
    subModo: null,
    enTransicion: false,
    numJuegos: 7,
    resultado: null,
    error: "",
    mostrarModal: false,
    probA: 0.5,
    probCasa: 0.6,
    probVisita: 0.4,
    formatoLocalia: new Array(7).fill(true),
    tablaProbabilidades: [],
  };

  // useState
  const [modo, setModo] = useState(estadoInicial.modo);
  const [subModo, setSubModo] = useState(estadoInicial.subModo);
  const [enTransicion, setEnTransicion] = useState(estadoInicial.enTransicion);
  const [numJuegos, setNumJuegos] = useState(estadoInicial.numJuegos);
  const [resultado, setResultado] = useState(estadoInicial.resultado);
  const [error, setError] = useState(estadoInicial.error);
  const [mostrarModal, setMostrarModal] = useState(estadoInicial.mostrarModal);

  const [probA, setProbA] = useState(estadoInicial.probA);
  const [probCasa, setProbCasa] = useState(estadoInicial.probCasa);
  const [probVisita, setProbVisita] = useState(estadoInicial.probVisita);
  const [formatoLocalia, setFormatoLocalia] = useState(
    estadoInicial.formatoLocalia
  );

  const [tablaProbabilidades, setTablaProbabilidades] = useState(
    estadoInicial.tablaProbabilidades
  );

  // Función para resetear todo
  const resetearTodo = useCallback(() => {
    setModo(estadoInicial.modo);
    setSubModo(estadoInicial.subModo);
    setEnTransicion(estadoInicial.enTransicion);
    setNumJuegos(estadoInicial.numJuegos);
    setResultado(estadoInicial.resultado);
    setError(estadoInicial.error);
    setMostrarModal(estadoInicial.mostrarModal);
    setProbA(estadoInicial.probA);
    setProbCasa(estadoInicial.probCasa);
    setProbVisita(estadoInicial.probVisita);
    setFormatoLocalia([...estadoInicial.formatoLocalia]);
    setTablaProbabilidades([...estadoInicial.tablaProbabilidades]);
  }, []);

  // Actualiza formato de localía cuando cambia n
  useEffect(() => {
    const n = parseInt(numJuegos, 10);
    if (isNaN(n) || n <= 0 || n > 11) {
      if (n > 11)
        setError("El número máximo de juegos (n) no puede ser mayor que 11.");
      return;
    }
    setError("");
    setFormatoLocalia((formatoActual) => {
      const nuevoFormato = new Array(n).fill(true);
      for (let i = 0; i < Math.min(n, formatoActual.length); i++) {
        nuevoFormato[i] = formatoActual[i];
      }
      return nuevoFormato;
    });
  }, [numJuegos]);

  const alternarLocalia = (indice) => {
    setFormatoLocalia((formatoActual) => {
      const nuevoFormato = [...formatoActual];
      nuevoFormato[indice] = !nuevoFormato[indice];
      return nuevoFormato;
    });
  };

  // Cálculo del modo normal
  const calcularProbabilidadNormal = useCallback(() => {
    if (numJuegos <= 0 || numJuegos > 11 || probA < 0 || probA > 1) {
      setError("Por favor, introduce valores válidos.");
      return;
    }

    const kGanador = Math.floor(numJuegos / 2) + 1;
    const memo = new Map();

    function resolver(i, j) {
      if (i === 0) return 1;
      if (j === 0) return 0;
      const clave = `${i}-${j}`;
      if (memo.has(clave)) return memo.get(clave);
      const prob = probA * resolver(i - 1, j) + (1 - probA) * resolver(i, j - 1);
      memo.set(clave, prob);
      return prob;
    }

    const valorResultado = resolver(kGanador, kGanador);
    setResultado(valorResultado);

    const tabla = [];
    for (let i = 0; i <= kGanador; i++) {
      const fila = [];
      for (let j = 0; j <= kGanador; j++) {
        fila.push(resolver(i, j));
      }
      tabla.push(fila);
    }

    setTablaProbabilidades(tabla);
    setError("");
    setMostrarModal(true);
  }, [numJuegos, probA]);

  // Cálculo con ventaja de localía
  const calcularProbabilidadLocalia = useCallback(() => {
    if (
      numJuegos <= 0 ||
      numJuegos > 11 ||
      probCasa < 0 ||
      probCasa > 1 ||
      probVisita < 0 ||
      probVisita > 1
    ) {
      setError("Por favor, introduce valores válidos.");
      return;
    }

    const kGanador = Math.floor(numJuegos / 2) + 1;
    const memo = new Map();

    function resolver(juegosGanadosA, juegosGanadosB) {
      if (juegosGanadosA === kGanador) return 1.0;
      if (juegosGanadosB === kGanador) return 0.0;

      const numeroJuego = juegosGanadosA + juegosGanadosB;
      const clave = `${juegosGanadosA}-${juegosGanadosB}`;
      if (memo.has(clave)) return memo.get(clave);

      const esLocalA = formatoLocalia[numeroJuego];
      const probGanarA = esLocalA ? probCasa : probVisita;

      const prob =
        probGanarA * resolver(juegosGanadosA + 1, juegosGanadosB) +
        (1 - probGanarA) * resolver(juegosGanadosA, juegosGanadosB + 1);

      memo.set(clave, prob);
      return prob;
    }

    const valorResultado = resolver(0, 0);
    setResultado(valorResultado);

    const tabla = [];
    for (let i = 0; i <= kGanador; i++) {
      const fila = [];
      for (let j = 0; j <= kGanador; j++) {
        let prob;
        if (i === 0) prob = 1.0;
        else if (j === 0) prob = 0.0;
        else {
          const juegosGanadosA = kGanador - i;
          const juegosGanadosB = kGanador - j;
          prob = resolver(juegosGanadosA, juegosGanadosB);
        }
        fila.push(prob);
      }
      tabla.push(fila);
    }

    setTablaProbabilidades(tabla);
    setError("");
    setMostrarModal(true);
  }, [numJuegos, probCasa, probVisita, formatoLocalia]);

  // Transiciones entre modos
  const cambiarModo = (nuevoModo) => {
    setEnTransicion(true);
    setTimeout(() => {
      setModo(nuevoModo);
      setSubModo(null);
      setResultado(null);
      setError("");
      setTablaProbabilidades([]);
      setEnTransicion(false);
    }, 400);
  };

  const cambiarSubModo = (nuevoSubModo) => {
    setEnTransicion(true);
    setTimeout(() => {
      setSubModo(nuevoSubModo);
      setResultado(null);
      setError("");
      setTablaProbabilidades([]);
      setEnTransicion(false);
    }, 400);
  };

  // Botones “Regresar”
  const reiniciarModo = () => {
    setEnTransicion(true);
    setTimeout(() => {
      resetearTodo();
      setEnTransicion(false);
    }, 400);
  };

  const regresarSubModo = () => {
    setEnTransicion(true);
    setTimeout(() => {
      setSubModo(null);
      setResultado(null);
      setError("");
      setTablaProbabilidades([]);
      setMostrarModal(false);
      setNumJuegos(estadoInicial.numJuegos);
      setProbA(estadoInicial.probA);
      setProbCasa(estadoInicial.probCasa);
      setProbVisita(estadoInicial.probVisita);
      setFormatoLocalia([...estadoInicial.formatoLocalia]);
      setEnTransicion(false);
    }, 400);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setTablaProbabilidades([]);
  };

  // Carga de archivo JSON
  const manejarCargaArchivo = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = (evento) => {
      try {
        const datos = JSON.parse(evento.target.result);

        if (!datos.n || typeof datos.n !== "number" || datos.n <= 0) {
          setError("El archivo debe incluir un valor válido para 'n'.");
          return;
        }

        if (modo === "normal") {
          if (typeof datos.p !== "number" || datos.p < 0 || datos.p > 1) {
            setError("El archivo debe incluir un valor válido para 'p' (entre 0 y 1).");
            return;
          }

          setNumJuegos(datos.n);
          setProbA(datos.p);
          setError("");
        }

        if (modo === "localia") {
          if (
            typeof datos.ph !== "number" ||
            typeof datos.pv !== "number" ||
            datos.ph < 0 ||
            datos.ph > 1 ||
            datos.pv < 0 ||
            datos.pv > 1
          ) {
            setError(
              "El archivo debe incluir valores válidos para 'ph' y 'pv' (entre 0 y 1)."
            );
            return;
          }

          setNumJuegos(datos.n);
          setProbCasa(datos.ph);
          setProbVisita(datos.pv);
          setError("");
        }
      } catch (err) {
        console.error(err);
        setError("Error al leer el archivo. Verifica que esté en formato JSON válido.");
      }
    };
    lector.readAsText(archivo);
  };

  return (
  <div className="App series-page">
    <div className={`fade-container ${enTransicion ? "fade-out" : "fade-in"}`}>
      <h1>Series Deportivas</h1>

      {/* Selección de tipo de serie */}
      {modo === null && (
        <div className="mode-selection">
          <h2>Elige el tipo de serie:</h2>
          <button className="menu-boton" onClick={() => cambiarModo("normal")}>
            Serie Deportiva Normal
          </button>
          <button className="menu-boton" onClick={() => cambiarModo("localia")}>
            Serie con Ventaja de Localía
          </button>
        </div>
      )}

      {/* Selección de submodo */}
      {modo !== null && subModo === null && (
        <div className="mode-selection">
          <button className="link-boton" onClick={reiniciarModo}>
            &larr; Regresar
          </button>
          <h2>¿Cómo deseas calcular?</h2>
          <button className="menu-boton" onClick={() => cambiarSubModo("manual")}>
            Calcular ingresando Datos
          </button>
          <button className="menu-boton" onClick={() => cambiarSubModo("archivo")}>
            Calcular cargando Datos
          </button>
        </div>
      )}

      {/* Submodo: ingresar datos */}
      {modo !== null && subModo === "manual" && (
        <>
          <button className="link-boton" onClick={regresarSubModo}>
            &larr; Regresar
          </button>

          <div className="form-group-n">
            <label>Número máx. de juegos (n ≤ 11):</label>
            <input
              type="number"
              value={numJuegos}
              onChange={(e) => setNumJuegos(Math.min(parseInt(e.target.value) || 0, 11))}
              max={11}
              min={1}
            />
          </div>

          {/* Serie Normal */}
          {modo === "normal" && (
            <div className="mode-container">
              <h2>Modo: Serie Normal</h2>
              <p>La probabilidad de ganar es la misma en todos los juegos.</p>
              <div className="form-container">
                <div className="form-group">
                  <label>Prob. de A de ganar (p):</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={probA}
                    onChange={(e) => setProbA(parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <button className="menu-boton" onClick={calcularProbabilidadNormal}>
                Calcular Probabilidad
              </button>
            </div>
          )}

          {/* Serie con localía */}
          {modo === "localia" && (
            <div className="mode-container">
              <h2>Modo: Ventaja de Localía</h2>
              <p>La probabilidad depende de quién juegue en casa.</p>

              <div className="form-container">
                <div className="form-group">
                  <label>Prob. A gana en casa (ph):</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={probCasa}
                    onChange={(e) => setProbCasa(parseFloat(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Prob. A gana de visita (pv):</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={probVisita}
                    onChange={(e) => setProbVisita(parseFloat(e.target.value))}
                  />
                </div>
              </div>

              
              <div className="format-buttons">
                {formatoLocalia.map((esLocalA, i) => (
                  <button
                    key={i}
                    className={`format-button ${esLocalA ? "a-home" : "b-home"}`}
                    onClick={() => alternarLocalia(i)}
                  >
                    Juego {i + 1}: <strong>{esLocalA ? "A" : "B"}</strong>
                  </button>
                ))}
              </div>

              <button className="menu-boton" onClick={calcularProbabilidadLocalia}>
                Calcular Probabilidad
              </button>
            </div>
          )}
          {error && <p className="error-msg">{error}</p>}
        </>
      )}

      {/* Submodo: cargar archivo */}
      {modo !== null && subModo === "archivo" && (
        <>
          <button className="link-boton" onClick={regresarSubModo}>
            &larr; Regresar
          </button>

          <div className="mode-container">
            <h2>Modo: {modo === "normal" ? "Serie Normal" : "Ventaja de Localía"}</h2>
            <p>
              Sube un archivo JSON con el formato correcto según el tipo de serie (
              <strong>{modo === "normal" ? "Normal" : "Con Localía"}</strong>).
            </p>

            {/* Contenedor para alinear input y botón verticalmente */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
              <input type="file" accept=".json" onChange={manejarCargaArchivo} />

              {/* Formato visible solo si es con localía */}
              {modo === "localia" && (
                <>
                  
                  <div className="format-buttons">
                    {formatoLocalia.map((esLocalA, i) => (
                      <button
                        key={i}
                        className={`format-button ${esLocalA ? "a-home" : "b-home"}`}
                        onClick={() => alternarLocalia(i)}
                      >
                        Juego {i + 1}: <strong>{esLocalA ? "A" : "B"}</strong>
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button
                className="menu-boton"
                onClick={
                  modo === "normal"
                    ? calcularProbabilidadNormal
                    : calcularProbabilidadLocalia
                }
              >
                Calcular Probabilidad
              </button>
            </div>
          </div>


          {error && <p className="error-msg">{error}</p>}
        </>
      )}

      <button className="menu-boton" onClick={() => navegar("/")}>
        Volver al Menú Principal
      </button>
    </div>

    {/* Modal de resultado */}
    {mostrarModal && (
      <div className={`modal-overlay ${enTransicion ? "modal-fade-out" : "modal-fade-in"}`}>
        <div className="modal-content">
          <h2>Resultado</h2>
          <p>
            Probabilidad de que A gane la serie:{" "}
            <strong>{(resultado * 100).toFixed(4)} %</strong>
          </p>

          {tablaProbabilidades.length > 0 && (
            <div className="table-container">
              <h3 style={{ color: "#333" }}>Tabla de Probabilidades</h3>
              <p style={{ color: "#555", marginTop: "-10px", fontSize: "0.9em" }}>
                P(A gane | A necesita 'i' victorias, B necesita 'j' victorias)
              </p>

              <table className="prob-table">
                <thead>
                  <tr>
                    <th>i \ j</th>
                    {tablaProbabilidades[0]?.map((_, j) => (
                      <th key={j}>{j}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tablaProbabilidades.map((fila, i) => (
                    <tr key={i}>
                      <th>{i}</th>
                      {fila.map((prob, j) => (
                        <td key={j} className={i === 0 ? "win" : j === 0 ? "loss" : ""}>
                          {prob.toFixed(4)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            className="menu-boton"
            onClick={() => {
              setEnTransicion(true);
              setTimeout(() => {
                cerrarModal();
                setEnTransicion(false);
              }, 400);
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    )}
  </div>
);

}
