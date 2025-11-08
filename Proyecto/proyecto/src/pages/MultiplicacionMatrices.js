import React from "react";
import { useNavigate } from "react-router-dom";

export default function MultiplicacionMatrices() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <h1>Multiplicación de Matrices</h1>
      <p>Aquí se desarrollará el algoritmo de multiplicación óptima de matrices.</p>
      <button className="menu-boton" onClick={() => navigate("/")}>
        Volver al Menú
      </button>
    </div>
  );
}
