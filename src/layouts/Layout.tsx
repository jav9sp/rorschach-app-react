import { Outlet } from "react-router-dom";
import Footer from "../components/ui/Footer";
import Header from "../components/ui/Header";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto p-4 main-height">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
