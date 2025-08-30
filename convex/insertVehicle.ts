import { mutation } from "./_generated/server"
import type { Id } from "./_generated/dataModel"

// Recibe la data del vehículo y la inserta en la tabla `vehicles`.
export const insertVehicle = mutation(
  async ({ db }, { vehicleData }: { vehicleData: any }) => {
    // Si necesitas un ID de usuario, aquí podrías obtenerlo con la Auth de Convex o que te lo manden como parte de vehicleData.
    // Por ejemplo: 
    // const user = await auth.getUserIdentity();
    // if (!user) throw new Error("User not authenticated");

    const id = await db.insert("vehicles", {
      // Deja pasar todos los campos si tu schema coincide.
      ...vehicleData,
      // o bien asigna manualmente cada propiedad si lo prefieres.
      // userId: userToken ?? "", 
    })

    return id
  }
)
