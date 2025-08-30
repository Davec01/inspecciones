import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    user: v.optional(v.id("users")),
  }),

  inspecciones: defineTable({
    conductor: v.string(),
    contrato: v.string(),
    responsableJefe: v.string(),
    vehiculo: v.string(),
    numeroInterno: v.string(),
    odometro: v.string(),

    documentos: v.object({
      licenciaConduccion: v.boolean(),
      licenciaTransito: v.boolean(),
      soat: v.boolean(),
      revisionTecnoMecanica: v.boolean(),
      extractoContrato: v.boolean(),
      tarjetaOperacion: v.boolean(),
    }),

    rinesYllantas: v.object({
      estadoRines: v.boolean(),
      estadoLlantas: v.boolean(),
      labrado: v.array(v.string()),
      presion: v.array(v.string()),
    }),

    fotos: v.object({
      frontal: v.union(v.string(), v.null()),
      lateral: v.union(v.string(), v.null()),
      trasera: v.union(v.string(), v.null()),
      interior: v.union(v.string(), v.null()),
    }),
  }),
});
