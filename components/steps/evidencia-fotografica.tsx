"use client"

import type React from "react"
import type { VehicleData } from "../inspeccion-form"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

interface EvidenciaFotograficaProps {
  data: VehicleData
  updateData: (data: Partial<VehicleData>) => void
  onNext: () => void
  onPrev: () => void
}

export function EvidenciaFotografica({ data, updateData, onNext, onPrev }: EvidenciaFotograficaProps) {
  const handleImageUpload = (position: keyof typeof data.fotos, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        updateData({
          fotos: {
            ...data.fotos,
            [position]: reader.result as string,
          },
        })
      }

      reader.readAsDataURL(file)
    }
  }

  const removeImage = (position: keyof typeof data.fotos) => {
    updateData({
      fotos: {
        ...data.fotos,
        [position]: null,
      },
    })
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Fotografías del vehículo</h2>
      <p className="text-gray-500 text-sm mb-4">(opcional)</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          {data.fotos.frontal ? (
            <div className="relative">
              <img
                src={data.fotos.frontal || "/placeholder.svg"}
                alt="Frontal"
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage("frontal")}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
              <PlusIcon className="h-8 w-8 text-gray-400" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload("frontal", e)}
              />
            </label>
          )}
          <span className="text-sm text-gray-500 mt-1">Frontal</span>
        </div>

        <div className="flex flex-col items-center">
          {data.fotos.lateral ? (
            <div className="relative">
              <img
                src={data.fotos.lateral || "/placeholder.svg"}
                alt="Lateral"
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage("lateral")}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
              <PlusIcon className="h-8 w-8 text-gray-400" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload("lateral", e)}
              />
            </label>
          )}
          <span className="text-sm text-gray-500 mt-1">Lateral</span>
        </div>

        <div className="flex flex-col items-center">
          {data.fotos.trasera ? (
            <div className="relative">
              <img
                src={data.fotos.trasera || "/placeholder.svg"}
                alt="Trasera"
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage("trasera")}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
              <PlusIcon className="h-8 w-8 text-gray-400" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload("trasera", e)}
              />
            </label>
          )}
          <span className="text-sm text-gray-500 mt-1">Trasera</span>
        </div>

        <div className="flex flex-col items-center">
          {data.fotos.interior ? (
            <div className="relative">
              <img
                src={data.fotos.interior || "/placeholder.svg"}
                alt="Interior"
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage("interior")}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
              <PlusIcon className="h-8 w-8 text-gray-400" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload("interior", e)}
              />
            </label>
          )}
          <span className="text-sm text-gray-500 mt-1">Interior</span>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onPrev}>
          ← Atrás
        </Button>
        <Button type="button" onClick={onNext}>
          Siguiente →
        </Button>
      </div>
    </div>
  )
}
