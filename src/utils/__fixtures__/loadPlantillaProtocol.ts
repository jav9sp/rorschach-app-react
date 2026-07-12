import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as XLSX from "xlsx";
import type { Answer } from "../buildMasterSummary";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Lee el Excel real que la app distribuye (`public/plantilla.xlsx`) en vez
 * de mantener una copia JSON aparte de sus datos. Así el fixture de tests
 * nunca puede desincronizarse del archivo que de verdad descargan los
 * usuarios — justo la clase de bug que motivó este archivo (ver el fix de
 * la convención de Z en moduleZScore.ts).
 */
export function loadPlantillaProtocol(): Answer[] {
  const filePath = path.resolve(__dirname, "../../../public/plantilla.xlsx");
  const buffer = readFileSync(filePath);
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets["PROTOCOLO"];
  return XLSX.utils.sheet_to_json(sheet) as Answer[];
}
