import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Landing from "./views/Landing";
import CalculateProtocol from "./views/CalculateProtocol";

// La ruta "/nuevo-protocolo" (carga manual de respuestas, ver NewProtocol.tsx
// y protocol-reducer.ts) se retiró del router: el reducer no implementa
// borrar/limpiar respuestas y el flujo no conecta con buildMasterSummary.
// Los archivos se mantienen para retomarlo más adelante.
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} index />
          <Route path="/calcular" element={<CalculateProtocol />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
