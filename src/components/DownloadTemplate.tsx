export default function DownloadTemplate() {
  return (
    <a
      href="/plantilla.xlsx"
      download="plantilla.xlsx"
      className="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mx-auto my-6 w-fit">
      Descargar protocolo de prueba
    </a>
  );
}
