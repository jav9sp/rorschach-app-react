import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Landing from "./views/Landing";
import CalculateProtocol from "./views/CalculateProtocol";
import NewProtocol from "./views/NewProtocol";
import { useReducer } from "react";
import { initialState, protocolReducer } from "./reducers/protocol-reducer";

export default function AppRouter() {
  const [state, dispatch] = useReducer(protocolReducer, initialState);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} index />
          <Route path="/calcular" element={<CalculateProtocol />} />
          <Route
            path="/nuevo-protocolo"
            element={<NewProtocol state={state} dispatch={dispatch} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
