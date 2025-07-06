import type { StructuralSummaryData } from "../types/StructuralSummaryData";

type StructuralSummaryProps = {
  data: StructuralSummaryData;
};

export default function StructuralSummary({ data }: StructuralSummaryProps) {
  const detsCodigos: Array<keyof Partial<StructuralSummaryData>> = [
    "M",
    "FM",
    "m",
    "FC",
    "CF",
    "C",
    "Cn",
    "FC'",
    "C'F",
    "C'",
    "FT",
    "TF",
    "T",
    "FV",
    "VF",
    "V",
    "FY",
    "YF",
    "Y",
    "Fr",
    "rF",
    "FD",
    "F",
  ];

  const contCodigos: Array<keyof Partial<StructuralSummaryData>> = [
    "H",
    "(H)",
    "Hd",
    "(Hd)",
    "Hx",
    "A",
    "(A)",
    "Ad",
    "(Ad)",
    "An",
    "Art",
    "Ay",
    "Bl",
    "Bt",
    "Cg",
    "Cl",
    "Ex",
    "Fd",
    "Fi",
    "Ge",
    "Hh",
    "Ls",
    "Na",
    "Sc",
    "Sx",
    "Xy",
    "Idio",
  ];

  return (
    <div className="font-mono text-sm p-4">
      <h1 className="text-lg font-bold text-center mb-4">
        SUMARIO ESTRUCTURAL
      </h1>

      <div className="md:grid md:grid-cols-4 flex flex-col gap-4">
        {/* Localización */}
        <div className="border border-gray-300 rounded p-2 space-y-3">
          <div>
            <h2 className="font-bold underline mb-1 text-center">
              Localización
            </h2>
            <p>Zf = {data.Zf}</p>
            <p>ZSum = {data.Zsum}</p>
            <p>ZEst = {data.Zest}</p>
            <br />
            <p>W = {data.W}</p>
            <p>D = {data.D}</p>
            <p>W+D = {data["W+D"]}</p>
            <p>Dd = {data.Dd}</p>
            <p>S = {data.S}</p>
            <br />
            <span className="font-black">DQ</span>
            <p>+ = {data["DQ+"]}</p>
            <p>o = {data["DQo"]}</p>
            <p>v = {data["DQv"]}</p>
            <p>v/+ = {data["DQv/+"]}</p>
          </div>
          <div>
            <h2 className="font-bold underline mb-1 text-center">
              Calidad Formal
            </h2>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <br />
                <p>+</p>
                <p>o</p>
                <p>u</p>
                <p>-</p>
                <p>sin</p>
              </div>
              <div>
                <p>FQx</p>
                <p>= {data["FQx+"]}</p>
                <p>= {data["FQxo"]}</p>
                <p>= {data["FQxu"]}</p>
                <p>= {data["FQx-"]}</p>
                <p>= {data["FQxsin"]}</p>
              </div>
              <div>
                <p>MQx</p>
                <p>= {data["MQ+"]}</p>
                <p>= {data["MQo"]}</p>
                <p>= {data["MQu"]}</p>
                <p>= {data["MQ-"]}</p>
                <p>= {data["MQsin"]}</p>
              </div>
              <div>
                <p>W+D</p>
                <p>= {data["WDx+"]}</p>
                <p>= {data["WDxo"]}</p>
                <p>= {data["WDxu"]}</p>
                <p>= {data["WDx-"]}</p>
                <p>= {data["WDxsin"]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Determinantes */}
        <div className="border border-gray-300 rounded p-2">
          <h2 className="font-bold underline mb-1 text-center">
            Determinantes
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h3 className="italic">Complejos</h3>
              <hr className="text-gray-300 my-2" />
              {data.RespComplejas.map((resp, i) => (
                <p key={i}>{resp}</p>
              ))}
            </div>
            <div>
              {/* Agrega todos los demás... */}
              <h3 className="italic">Sencillos</h3>
              <hr className="text-gray-300 my-2" />
              <div className="grid grid-cols-3">
                <div className="col-span-2">
                  {detsCodigos.map((det, i) => (
                    <p key={i}>{det}:</p>
                  ))}
                  <br />
                  <p>(2):</p>
                </div>
                <div>
                  {detsCodigos.map((det, i) => {
                    const value = data[det];
                    if (
                      typeof value === "string" ||
                      typeof value === "number"
                    ) {
                      return <p key={i}>{value}</p>;
                    }
                    return null; // Si es un objeto como Secuencia, no mostrar nada aquí
                  })}
                  <br />
                  <p>{data.Pares}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenidos */}
        <div className="border border-gray-300 rounded p-2">
          <h2 className="font-bold underline mb-1 text-center">Contenidos</h2>
          <div className="grid grid-cols-3">
            <div className="col-span-2">
              {contCodigos.map((det, i) => (
                <p key={i}>{det}:</p>
              ))}
            </div>
            <div>
              {contCodigos.map((det, i) => {
                const value = data[det];
                if (typeof value === "string" || typeof value === "number") {
                  return <p key={i}>{value}</p>;
                }
                return null;
              })}
            </div>
          </div>
        </div>

        {/* Resumen del enfoque */}
        <div className="space-y-3">
          <div className="border border-gray-300 rounded p-2">
            <h2 className="font-bold underline mb-1 text-center">
              Resumen del enfoque
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="italic">Lámina</p>
                <hr className="text-gray-300 my-2" />
                <p>I: </p>
                <hr className="text-gray-300" />
                <p>II: </p>
                <hr className="text-gray-300" />
                <p>III: </p>
                <hr className="text-gray-300" />
                <p>IV: </p>
                <hr className="text-gray-300" />
                <p>V: </p>
                <hr className="text-gray-300" />
                <p>VI: </p>
                <hr className="text-gray-300" />
                <p>VII: </p>
                <hr className="text-gray-300" />
                <p>VIII: </p>
                <hr className="text-gray-300" />
                <p>IX: </p>
                <hr className="text-gray-300" />
                <p>X: </p>
              </div>
              <div>
                <p className="italic">Loc</p>
                <hr className="text-gray-300 my-2" />
                <p className="flex flex-wrap gap-2">
                  {data.Secuencia["I"].map((loc, i) => (
                    <span key={i}>{loc}</span>
                  ))}
                </p>
                <hr className="text-gray-300" />
                <p className="flex flex-wrap gap-2">
                  {data.Secuencia["II"].map((loc, i) => (
                    <span key={i}>{loc}</span>
                  ))}
                </p>
                <hr className="text-gray-300" />
                <p className="flex flex-wrap gap-2">
                  {data.Secuencia["III"].map((loc, i) => (
                    <span key={i}>{loc}</span>
                  ))}
                </p>
                <hr className="text-gray-300" />
                <p className="flex flex-wrap gap-2">
                  {data.Secuencia["IV"].map((loc, i) => (
                    <span key={i}>{loc}</span>
                  ))}
                </p>
                <hr className="text-gray-300" />
                <p className="flex flex-wrap gap-2">
                  {data.Secuencia["V"].map((loc, i) => (
                    <span key={i}>{loc}</span>
                  ))}
                </p>
                <hr className="text-gray-300" />
                <p className="flex flex-wrap gap-2">
                  {data.Secuencia["VI"].map((loc, i) => (
                    <span key={i}>{loc}</span>
                  ))}
                </p>
                <hr className="text-gray-300" />
                <p className="flex flex-wrap gap-2">
                  {data.Secuencia["VII"].map((loc, i) => (
                    <span key={i}>{loc}</span>
                  ))}
                </p>
                <hr className="text-gray-300" />
                <p className="flex flex-wrap gap-2">
                  {data.Secuencia["VIII"].map((loc, i) => (
                    <span key={i}>{loc}</span>
                  ))}
                </p>
                <hr className="text-gray-300" />
                <p className="flex flex-wrap gap-2">
                  {data.Secuencia["IX"].map((loc, i) => (
                    <span key={i}>{loc}</span>
                  ))}
                </p>
                <hr className="text-gray-300" />
                <p className="flex flex-wrap gap-2">
                  {data.Secuencia["X"].map((loc, i) => (
                    <span key={i}>{loc}</span>
                  ))}
                </p>
              </div>
            </div>
          </div>
          <div className="border border-gray-300 rounded p-2">
            <h2 className="font-bold underline mb-1 text-center">
              Códigos Especiales
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <br />
                <p>DV</p>
                <p>INC</p>
                <p>DR</p>
                <p>FAB</p>
                <p>ALOG</p>
                <p>CONTAM</p>
                <p>SumBrut6</p>
                <p>SumPond6</p>
              </div>
              <div className="text-center">
                <p>Niv 1</p>
                <p>{data.DV1}</p>
                <p>{data.INC1}</p>
                <p>{data.DR1}</p>
                <p>{data.FAB1}</p>
                <p>{data.ALOG}</p>
                <p>{data.CONTAM}</p>
                <p>{data.SumBrut6}</p>
                <p>{data.SumPon6}</p>
              </div>
              <div className="text-center">
                <p>Niv 2</p>
                <p>{data.DV2}</p>
                <p>{data.INC2}</p>
                <p>{data.DR2}</p>
                <p>{data.FAB2}</p>
              </div>
            </div>
            <hr className="text-gray-300 my-2" />
            <div className="grid grid-cols-4 gap-2">
              <div>
                <p>AB</p>
                <p>AG</p>
                <p>COP</p>
                <p>CP</p>
              </div>
              <div className="text-center">
                <p>{data.AB}</p>
                <p>{data.AG}</p>
                <p>{data.COP}</p>
                <p>{data.CP}</p>
              </div>
              <div>
                <p>GHR</p>
                <p>PHR</p>
                <p>MOR</p>
                <p>PER</p>
                <p>PSV</p>
              </div>
              <div className="text-center">
                <p>{data.GHR}</p>
                <p>{data.PHR}</p>
                <p>{data.MOR}</p>
                <p>{data.PER}</p>
                <p>{data.PSV}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:grid md:grid-cols-4 flex flex-col gap-4 mt-4">
        {/* Secciones inferiores */}
        <div className="border border-gray-300 rounded p-2 col-span-2">
          <h2 className="font-bold underline mb-1 text-center">
            Sección principal
          </h2>
          <div className="grid grid-cols-6">
            <p>R</p>
            <p>{data.R}</p>
            <p>L</p>
            <p>{data.Lambda}</p>
          </div>
          <hr className="text-gray-300 my-2" />
          <div className="grid grid-cols-3">
            <div className="grid grid-cols-2">
              <div>
                <p>EB</p>
                <p>eb</p>
              </div>
              <div>
                <p>{data.EB}</p>
                <p>{data.eb}</p>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div>
                <p>EA</p>
                <p>es</p>
                <p>Adj es</p>
              </div>
              <div>
                <p>{data.EA}</p>
                <p>{data.es}</p>
                <p>{data.Adjes}</p>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div>
                <p>EBPer</p>
                <p>D</p>
                <p>Adj D</p>
              </div>
              <div>
                <p>{data.EBPer}</p>
                <p>{data.PuntD}</p>
                <p>{data.AdjD}</p>
              </div>
            </div>
          </div>
          <hr className="text-gray-300 my-2" />

          <div className="grid grid-cols-3">
            <div className="grid grid-cols-2">
              <div>
                <p>FM</p>
                <p>m</p>
              </div>
              <div>
                <p>{data.FM}</p>
                <p>{data.m}</p>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div>
                <p>SumC'</p>
                <p>SumV</p>
              </div>
              <div>
                <p>{data["SumC'"]}</p>
                <p>{data.SumV}</p>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div>
                <p>SumT</p>
                <p>SumY</p>
              </div>
              <div>
                <p>{data.SumT}</p>
                <p>{data.SumY}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-300 rounded p-2">
          <h2 className="font-bold underline mb-1 text-center">Afectos</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <p>FC:CF+C</p>
              <p>C Pura</p>
              <p>SumC':SumPonC</p>
              <p>Afr</p>
              <p>S</p>
              <p>Compljs:R</p>
              <p>Compljs%</p>
              <p>CP</p>
            </div>
            <div>
              <p>{data["FC:CF+C+Cn"]}</p>
              <p>{data.C}</p>
              <p>{data["SumC':SumPonC"]}</p>
              <p>{data.Afr}</p>
              <p>{data.S}</p>
              <p>{data["Compljs:R"]}</p>
              <p>{(data.Compljs / data.R).toFixed(2)}</p>
              <p>{data.CP}</p>
            </div>
          </div>
        </div>

        <div className="border border-gray-300 rounded p-2">
          <h2 className="font-bold underline mb-1 text-center">
            Interpersonal
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <p>COP</p>
              <p>AG</p>
              <p>GHR:PHR</p>
              <p>a:p</p>
              <p>Fd</p>
              <p>SumT</p>
              <p>Todo H</p>
              <p>H Pura</p>
              <p>PER</p>
              <p>Aisl/R</p>
            </div>
            <div>
              <p>{data.COP}</p>
              <p>{data.AG}</p>
              <p>{data["GHR:PHR"]}</p>
              <p>{data["a:p"]}</p>
              <p>{data.Fd}</p>
              <p>{data.SumT}</p>
              <p>{data.TodoH}</p>
              <p>{data.H}</p>
              <p>{data.PER}</p>
              <p>{data["Aisl/R"]}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:grid md:grid-cols-4 flex flex-col gap-2 mt-4">
        <div className="border border-gray-300 rounded p-2">
          <h2 className="font-bold underline mb-1 text-center">Ideación</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <p>a:p</p>
              <p>Ma:Mp</p>
              <p>2AB+Art+Ay</p>
              <p>MOR</p>
              <p>SumBrut6</p>
              <p>Nivel-2</p>
              <p>SumPond6</p>
              <p>MQ-</p>
              <p>MQsin</p>
            </div>
            <div>
              <p>{data["a:p"]}</p>
              <p>{data["Ma:Mp"]}</p>
              <p>{data.Intelec}</p>
              <p>{data.MOR}</p>
              <p>{data.SumBrut6}</p>
              <p>{data["Nvl-2"]}</p>
              <p>{data.SumPon6}</p>
              <p>{data["MQ-"]}</p>
              <p>{data.MQsin}</p>
            </div>
          </div>
        </div>

        <div className="border border-gray-300 rounded p-2">
          <h2 className="font-bold underline mb-1 text-center">Mediación</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <p>XA%</p>
              <p>WDA%</p>
              <p>X-%</p>
              <p>S-</p>
              <p>P</p>
              <p>X+%</p>
              <p>Xu%</p>
            </div>
            <div>
              <p>{data["XA%"]}</p>
              <p>{data["WDA%"]}</p>
              <p>{data["X-%"]}</p>
              <p>{data["S-"]}</p>
              <p>{data.Populares}</p>
              <p>{data["X+%"]}</p>
              <p>{data["Xu%"]}</p>
            </div>
          </div>
        </div>

        <div className="border border-gray-300 rounded p-2">
          <h2 className="font-bold underline mb-1 text-center">
            Procesamiento
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <p>Zf</p>
              <p>W:D:Dd</p>
              <p>W:M</p>
              <p>Zd</p>
              <p>PSV</p>
              <p>DQ+</p>
              <p>DQv</p>
            </div>
            <div>
              <p>{data.Zf}</p>
              <p>{data["W:D:Dd"]}</p>
              <p>{data["W:M"]}</p>
              <p>{data.Zd}</p>
              <p>{data.PSV}</p>
              <p>{data["DQ+"]}</p>
              <p>{data.DQv}</p>
            </div>
          </div>
        </div>
        <div className="border border-gray-300 rounded p-2">
          <h2 className="font-bold underline mb-1 text-center">
            Autopercepción
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <p>I. Ego</p>
              <p>Fr+rF</p>
              <p>SumV</p>
              <p>Fd</p>
              <p>An+Xy</p>
              <p>MOR</p>
              <p>H:(H)+Hd+(Hd)</p>
            </div>
            <div>
              <p>{data.Ego}</p>
              <p>{data["Fr+rF"]}</p>
              <p>{data.SumV}</p>
              <p>{data.Fd}</p>
              <p>{data["An+Xy"]}</p>
              <p>{data.MOR}</p>
              <p>{data["H:(H)+Hd+(Hd)"]}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-t-gray-300 pt-2 text-center">
        <p>
          PTI = {data.PTI} | DEPI = {data["DEPI Contador"]} | CDI ={" "}
          {data["CDI Contador"]} | S-CON = {data["SCON Contador"]} | HVI ={" "}
          {data.HVI} | OBS = {data.OBS}
        </p>
      </div>
    </div>
  );
}
