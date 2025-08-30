// app/api/vehiculos-por-responsable/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

type RawItem = {
  id: number;
  contrato: string;
  responsable: string;
  empleado: string;
  vehiculo: string;
  numero_interno: string;
  odometer_actual?: number;
};

function norm(s: unknown): string {
  return String(s ?? "").normalize("NFC").trim().toLowerCase();
}

export async function GET(req: NextRequest) {
  const qResp = (req.nextUrl.searchParams.get("responsable") || "").trim();
  const qPersona = (req.nextUrl.searchParams.get("persona") || "").trim();

  if (!qResp && !qPersona) {
    return NextResponse.json(
      { error: "Se requiere 'responsable' o 'persona' en querystring" },
      { status: 400 }
    );
  }

  try {
    const filePath = path.join(process.cwd(), "preoperacional.json");
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as { items?: RawItem[] };

    const items = parsed.items ?? [];
    const wantResp = norm(qResp);
    const wantPers = norm(qPersona);

    let universe: RawItem[] = [];

    if (qResp) {
      // Solo registros del responsable
      universe = items.filter((it) => norm(it.responsable) === wantResp);
    }

    if (qPersona) {
      // 1) contratos donde esa persona aparece como empleado
      const contratosDeLaPersona = new Set(
        items.filter((it) => norm(it.empleado) === wantPers).map((it) => it.contrato)
      );
      // 2) unir todos los ítems de esos contratos
      const allFromContracts = items.filter((it) =>
        contratosDeLaPersona.has(it.contrato)
      );
      universe = qResp ? [...universe, ...allFromContracts] : allFromContracts;
    }

    if (!universe.length) {
      return NextResponse.json({
        responsable: qResp || null,
        persona: qPersona || null,
        contratos: [],
        message: "Sin coincidencias para el filtro indicado",
      });
    }

    // Agrupar por contrato y calcular responsable por contrato
    const contratosMap = new Map<
      string,
      {
        contrato: string;
        responsablesCount: Map<string, number>;
        vehiculos: Array<{
          id: number;
          numeroInterno: string;
          vehiculo: string;
          odometro?: number;
          empleado?: string;
        }>;
      }
    >();

    for (const it of universe) {
      const contrato = it.contrato || "(Sin contrato)";
      if (!contratosMap.has(contrato)) {
        contratosMap.set(contrato, {
          contrato,
          responsablesCount: new Map(),
          vehiculos: [],
        });
      }
      const bucket = contratosMap.get(contrato)!;

      // contar responsables
      const r = it.responsable?.trim() || "";
      if (r) bucket.responsablesCount.set(r, (bucket.responsablesCount.get(r) || 0) + 1);

      // deduplicar vehículos
      const numInt = String(it.numero_interno ?? "").trim();
      const vehTxt = String(it.vehiculo ?? "").trim();
      const ya = bucket.vehiculos.find(
        (v) =>
          (numInt && v.numeroInterno === numInt) ||
          (!numInt && vehTxt && v.vehiculo === vehTxt)
      );
      if (!ya) {
        bucket.vehiculos.push({
          id: it.id,
          numeroInterno: numInt || "-",
          vehiculo: vehTxt || "-",
          odometro: typeof it.odometer_actual === "number" ? it.odometer_actual : undefined,
          empleado: it.empleado || undefined,
        });
      }
    }

    // construir salida con responsable por contrato
    const contratos = Array.from(contratosMap.values())
      .map((c) => {
        // si vino qResp, usarlo; si no, tomar el más frecuente
        let responsableContrato = qResp || null;
        if (!responsableContrato) {
          let best: string | null = null;
          let max = -1;
          for (const [name, count] of c.responsablesCount.entries()) {
            if (count > max) {
              max = count;
              best = name;
            }
          }
          responsableContrato = best;
        }
        return {
          contrato: c.contrato,
          responsable: responsableContrato ?? undefined,
          vehiculos: c.vehiculos.sort((a, b) =>
            String(a.numeroInterno).localeCompare(String(b.numeroInterno))
          ),
        };
      })
      .sort((a, b) => a.contrato.localeCompare(b.contrato));

    return NextResponse.json({
      responsable: qResp || null,
      persona: qPersona || null,
      contratos,
    });
  } catch (err) {
    console.error("Error leyendo preoperacional.json:", err);
    return NextResponse.json({ error: "No se pudo leer el JSON" }, { status: 500 });
  }
}
