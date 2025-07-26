import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 left-0 bg-white/50 backdrop-blur-sm w-full border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link to={"/"}>
          <img
            src="/logo-manchas-de-tinta.png"
            alt="Logo Manchas de Tinta"
            className="w-12"
          />
        </Link>
        <nav>
          {location.pathname === "/calcular" ? (
            <Link
              to={"/"}
              className="font-semibold text-teal-600 hover:text-teal-800 transition-colors">
              Volver a Inicio
            </Link>
          ) : (
            <Link
              to={"/calcular"}
              className="font-semibold text-teal-600 hover:text-teal-800 transition-colors">
              Probar App
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
