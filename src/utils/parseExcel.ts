import * as XLSX from "xlsx";
import type { Answer } from "./buildMasterSummary";
// Importa tu tipo

/**
 * Parsea un archivo Excel a un array de Respuesta
 * @param file Archivo Excel (.xlsx)
 * @returns Array de objetos Respuesta[]
 */
export async function parseExcel(file: File): Promise<Answer[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (!result) {
        reject(new Error("No se pudo leer el archivo"));
        return;
      }

      const data = new Uint8Array(result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convierto a JSON
      const json: Answer[] = XLSX.utils.sheet_to_json(worksheet) as Answer[];
      resolve(json);
    };

    reader.onerror = () => reject(new Error("Error leyendo archivo"));

    reader.readAsArrayBuffer(file);
  });
}
