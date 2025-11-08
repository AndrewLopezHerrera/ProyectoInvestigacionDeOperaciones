import React from "react";
import { useNavigate } from "react-router-dom";

export default function Salir() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <h1>Salir del Programa</h1>
      <p>Gracias por usar la aplicación</p>
      <button className="menu-boton" onClick={() => navigate("/")}>
        Volver al Menú
      </button>
    </div>
  );
}
