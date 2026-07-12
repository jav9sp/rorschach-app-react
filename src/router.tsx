import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Landing from "./views/Landing";
import CalculateProtocol from "./views/CalculateProtocol";
import CodeProtocol from "./views/CodeProtocol";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} index />
          <Route path="/codificar" element={<CodeProtocol />} />
          <Route path="/calcular" element={<CalculateProtocol />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
