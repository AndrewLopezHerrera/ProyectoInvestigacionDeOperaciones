import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./SeriesDeportivas.css";

export default function SeriesDeportivas() {
  const navegar = useNavigate();

  const [modo, setModo] = useState(null);
  const [enTransicion, setEnTransicion] = useState(false);
  const [numJuegos, setNumJuegos] = useState(7);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const [probA, setProbA] = useState(0.5);
  const [probCasa, setProbCasa] = useState(0.6);
  const [probVisita, setProbVisita] = useState(0.4);
  const [formatoLocalia, setFormatoLocalia] = useState(() => new Array(7).fill(true));

  const [tablaProbabilidades, setTablaProbabilidades] = useState([]);

  // Actualiza el formato de localía cuando cambia n
  useEffect(() => {
    const n = parseInt(numJuegos, 10);
    if (isNaN(n) || n <= 0 || n > 11) {
      if (n > 11) setError("El número máximo de juegos (n) no puede ser mayor que 11.");
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

  // 🔹 Cálculo del modo normal (sin ventaja de localía)
  const calcularProbabilidadNormal = useCallback(() => {
    if (numJuegos <= 0 || numJuegos > 11 || probA < 0 || probA > 1) {
      setError("Por favor, introduce valores válidos.");
      return;
    }

    const kGanador = Math.floor(numJuegos / 2) + 1;
    const memo = new Map();

    function resolver(i, j) {
      if (i === 0) return 1; // A ya ganó
      if (j === 0) return 0; // B ya ganó

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

  // 🔹 Cálculo con ventaja de localía
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

  const cambiarModo = (nuevoModo) => {
    setEnTransicion(true);
    setTimeout(() => {
      setModo(nuevoModo);
      setResultado(null);
      setError("");
      setTablaProbabilidades([]);
      setEnTransicion(false);
    }, 400);
  };

  const reiniciarModo = () => {
    cambiarModo(null);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setTablaProbabilidades([]);
  };

  return (
    <div className="App series-page">
      <div className={`fade-container ${enTransicion ? "fade-out" : "fade-in"}`}>
        <h1>Series Deportivas</h1>

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

        {modo !== null && (
          <>
            <button className="link-boton" onClick={reiniciarModo}>
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

            {modo === "localia" && (
              <div className="mode-container">
                <h2>Modo: Ventaja de Localía</h2>
                <p>La probabilidad depende de quién juegue en casa.</p>

                <div className="form-container">
                  <div className="form-group">
                    <label>Prob. A de ganar en casa (ph):</label>
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
                    <label>Prob. A de ganar de visita (pv):</label>
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

                <h3>Formato de la Serie (Quién es local)</h3>
                <div className="format-buttons">
                  {formatoLocalia.map((esLocalA, indice) => (
                    <button
                      key={indice}
                      className={`format-button ${esLocalA ? "a-home" : "b-home"}`}
                      onClick={() => alternarLocalia(indice)}
                    >
                      Juego {indice + 1}: <strong>{esLocalA ? "A" : "B"}</strong>
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

        <button className="menu-boton" onClick={() => navegar("/")}>
          Volver al Menú Principal
        </button>
      </div>

      {/* 🔹 Modal del resultado */}
      {mostrarModal && (
        <div
          className={`modal-overlay ${
            enTransicion ? "modal-fade-out" : "modal-fade-in"
          }`}
        >
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
                          <td
                            key={j}
                            className={i === 0 ? "win" : j === 0 ? "loss" : ""}
                          >
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
