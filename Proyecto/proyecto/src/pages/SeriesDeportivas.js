import React from "react";
import { useNavigate } from "react-router-dom";

export default function SeriesDeportivas() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <h1>Series Deportivas</h1>
      <p>Aquí se implementará la simulación de series deportivas.</p>
      <button className="menu-boton" onClick={() => navigate("/")}>
        Volver al Menú
      </button>
    </div>
  );
}
