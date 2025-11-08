import React from "react";
import { useNavigate } from "react-router-dom";

export default function ArbolesBinarios() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <h1>Árboles Binarios de Búsqueda Óptimos</h1>
      <p>Aquí se implementará el algoritmo correspondiente.</p>
      <button className="menu-boton" onClick={() => navigate("/")}>
        Volver al Menú
      </button>
    </div>
  );
}
