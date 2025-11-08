import React from "react";
import { useNavigate } from "react-router-dom";

export default function ReemplazoEquipos() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <h1>Reemplazo de Equipos</h1>
      <p>Aquí se implementará el algoritmo de reemplazo de equipos.</p>
      <button className="menu-boton" onClick={() => navigate("/")}>
        Volver al Menú
      </button>
    </div>
  );
}
