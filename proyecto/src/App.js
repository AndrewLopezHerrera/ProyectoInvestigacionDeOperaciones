import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";

// Importar las páginas
import ReemplazoEquipos from "./pages/ReemplazoEquipos";
import ArbolesBinarios from "./pages/ArbolesBinarios/ArbolesBinarios";
import SeriesDeportivas from "./pages/SeriesDeportivas/SeriesDeportivas";
import MultiplicacionMatrices from "./pages/MultiplicacionMatrices";
import Salir from "./pages/Salir";

// Página del menú principal
function MenuPrincipal() {
  const navigate = useNavigate();

  const opciones = [
    {
      nombre: "Reemplazo de Equipos",
      descripcion:
        "Algoritmo para optimizar el reemplazo de equipos considerando costos y rendimiento.",
      ruta: "/reemplazo-equipos",
    },
    {
      nombre: "Árboles Binarios de Búsqueda Óptimos",
      descripcion:
        "Construye árboles que minimizan el costo promedio de búsqueda.",
      ruta: "/arboles-binarios",
    },
    {
      nombre: "Series Deportivas",
      descripcion:
        "Modela probabilidades de victoria en series de múltiples partidos.",
      ruta: "/series-deportivas",
    },
    {
      nombre: "Multiplicación de Matrices",
      descripcion:
        "Calcula el orden óptimo de multiplicación de matrices usando Programación Dinámica.",
      ruta: "/multiplicacion-matrices",
    },
    {
      nombre: "Salir del Programa",
      descripcion: "Cerrar o regresar al menú anterior.",
      ruta: "/salir",
    },
  ];

  const fondo = process.env.PUBLIC_URL + "/fondo.jpg";

  return (
    <motion.div
      className="App"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="overlay"></div>

      <header className="menu-header">
        <h1>Menú Principal</h1>
        <p>Selecciona un algoritmo de Programación Dinámica para ejecutarlo.</p>
      </header>

      <div className="menu-contenedor">
        {opciones.map((opcion, index) => (
          <div className="menu-item" key={index}>
            {/* Tooltip */}
            <button
              className="menu-boton"
              title={opcion.descripcion}
              onClick={() => navigate(opcion.ruta)}
            >
              {opcion.nombre}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Componente con animación entre rutas
function AnimatedRoutes() {
  const location = useLocation();
  const fondo = process.env.PUBLIC_URL + "/fondo.jpg";

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="overlay"></div>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<MenuPrincipal />} />
          <Route
            path="/reemplazo-equipos"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <ReemplazoEquipos />
              </motion.div>
            }
          />
          <Route
            path="/arboles-binarios"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <ArbolesBinarios />
              </motion.div>
            }
          />
          <Route
            path="/series-deportivas"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <SeriesDeportivas />
              </motion.div>
            }
          />
          <Route
            path="/multiplicacion-matrices"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <MultiplicacionMatrices />
              </motion.div>
            }
          />
          <Route
            path="/salir"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <Salir />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

// App principal
function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
