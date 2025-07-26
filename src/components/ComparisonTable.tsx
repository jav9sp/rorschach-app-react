import type { Comparison } from "../types/NormativeData";

type ComparisonTableProps = {
  comparaciones: Comparison[];
  tipoVivencial: string;
};

export default function ComparisonTable({
  comparaciones,
  tipoVivencial,
}: ComparisonTableProps) {
  return (
    <>
      <div className="my-12">
        <h2 className="text-2xl font-bold">
          Comparación Normativa para Tipo Vivencial {tipoVivencial}
        </h2>
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 mt-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variable
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Media
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DT
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comparación
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comparaciones.map((c) => (
                <tr
                  key={c.VARIABLE}
                  className={`${
                    c.COMPARACION !== "Dentro del rango" ? "bg-amber-100" : ""
                  } hover:bg-gray-50`}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {c.VARIABLE}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {c.MEDIA}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {c.DT}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {c.VALOR}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {c.COMPARACION}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
