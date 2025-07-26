export default function Footer() {
  return (
    <footer className="text-sm text-gray-500 text-center p-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <span>© {new Date().getFullYear()}</span>{" "}
        <a href="https://manchasdetinta.net" target="blank">
          manchasdetinta.net
        </a>
      </div>
    </footer>
  );
}
