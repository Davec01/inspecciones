// app/api/guardar-inspeccion/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  let data: any;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  try {
    // Validaciones mínimas
    const required = ["conductor", "contrato", "responsableJefe", "vehiculo", "numeroInterno", "odometro"];
    for (const k of required) {
      if (data?.[k] == null || data?.[k] === "") {
        return NextResponse.json({ error: `Falta el campo: ${k}` }, { status: 400 });
      }
    }

    // Normalizaciones y defaults seguros
    const odometro = Number(data.odometro);
    const doc = data.documentos ?? {};
    const rl  = data.rinesYllantas ?? {};
    const labrado = Array.isArray(rl.labrado) ? rl.labrado.slice(0, 4) : [null, null, null, null];
    const presion = Array.isArray(rl.presion) ? rl.presion.slice(0, 4) : [null, null, null, null];

    const values = [
      data.conductor,
      data.contrato,
      data.responsableJefe,
      data.vehiculo,
      data.numeroInterno,
      isNaN(odometro) ? null : odometro,

      !!doc.licenciaConduccion,
      !!doc.licenciaTransito,
      !!doc.soat,
      !!doc.revisionTecnoMecanica,
      !!doc.extractoContrato,
      !!doc.tarjetaOperacion,

      !!rl.estadoRines,
      !!rl.estadoLlantas,

      labrado[0] === "" ? null : labrado[0],
      labrado[1] === "" ? null : labrado[1],
      labrado[2] === "" ? null : labrado[2],
      labrado[3] === "" ? null : labrado[3],

      presion[0] === "" ? null : presion[0],
      presion[1] === "" ? null : presion[1],
      presion[2] === "" ? null : presion[2],
      presion[3] === "" ? null : presion[3],
    ];

    const query = `
      INSERT INTO inspecciones (
        conductor, contrato, responsable_jefe, vehiculo, numero_interno, odometro,
        licencia_conduccion, licencia_transito, soat, revision_tecno_mecanica,
        extracto_contrato, tarjeta_operacion,
        estado_rines, estado_llantas,
        labrado_llanta_1, labrado_llanta_2, labrado_llanta_3, labrado_llanta_4,
        presion_llanta_1, presion_llanta_2, presion_llanta_3, presion_llanta_4
      ) VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,$12,
        $13,$14,
        $15,$16,$17,$18,
        $19,$20,$21,$22
      )
      RETURNING id
    `;

    const result = await pool.query(query, values);
    return NextResponse.json({ success: true, id: result.rows[0]?.id ?? null });
  } catch (error: any) {
    // Logs útiles para depurar
    console.error("Error al guardar en PostgreSQL:", {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
      table: error?.table,
      constraint: error?.constraint,
    });
    return NextResponse.json(
      { error: "Error al guardar", detail: error?.detail ?? error?.message },
      { status: 500 }
    );
  }
}
