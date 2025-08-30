import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Inserta una nueva inspección preoperacional en la tabla "inspecciones".
 */
export const insertInspection = mutation({
  args: {
    inspectionData: v.object({
      // Información general
      // placa: v.string(),
      contrato: v.string(),
      numeroInterno: v.string(),
      odometro: v.string(),
      vehiculo: v.string(),
      responsableJefe: v.string(),
      conductor: v.string(),

      // Observaciones (opcionales)
      observaciones: v.optional(v.string()),
      observacionesElementos: v.optional(v.string()),

      // Documentos del vehículo
      documentos: v.object({
        extractoContrato: v.boolean(),
        licenciaConduccion: v.boolean(),
        licenciaTransito: v.boolean(),
        revisionTecnoMecanica: v.boolean(),
        soat: v.boolean(),
        tarjetaOperacion: v.boolean(),
      }),

      // Rines y llantas
      rinesYllantas: v.object({
        estadoLlantas: v.boolean(),
        estadoRines: v.boolean(),
        labrado: v.array(v.string()),
        presion: v.array(v.string()),
      }),

      // Evidencia fotográfica
      fotos: v.object({
        frontal: v.union(v.string(), v.null()),
        lateral: v.union(v.string(), v.null()),
        trasera: v.union(v.string(), v.null()),
        interior: v.union(v.string(), v.null()),
      }),
    }),
  },

  handler: async (ctx, args) => {
    await ctx.db.insert("inspecciones", args.inspectionData);
  },
});