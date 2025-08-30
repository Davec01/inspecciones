"use client"

import { useState } from "react"
import type { VehicleData } from "../inspeccion-form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

interface VerificacionElementosProps {
  data: VehicleData
  updateData: (data: Partial<VehicleData>) => void
  onNext: () => void
  onPrev: () => void
}

export function VerificacionElementos({ data, updateData, onNext, onPrev }: VerificacionElementosProps) {
  const [activeTab, setActiveTab] = useState("documentos")

  const handleDocumentoChange = (key: keyof VehicleData["documentos"], checked: boolean) => {
    updateData({
      documentos: {
        ...data.documentos,
        [key]: checked,
      },
    })
  }

  const handleRinesLlantasChange = (key: keyof VehicleData["rinesYllantas"], value: any) => {
    updateData({
      rinesYllantas: {
        ...data.rinesYllantas,
        [key]: value,
      },
    })
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Verificación de Elementos</h2>

      <Tabs defaultValue="documentos" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documentos" className={activeTab === "documentos" ? "bg-[#b3e5fc] text-black" : ""}>
            Documentos
          </TabsTrigger>
          <TabsTrigger value="rines" className={activeTab === "rines" ? "bg-[#b3e5fc] text-black" : ""}>
            Rines y Llantas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documentos" className="space-y-4 mt-4">
          {Object.entries(data.documentos).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={`doc-${key}`}
                checked={value}
                onCheckedChange={(checked) => handleDocumentoChange(key as keyof VehicleData["documentos"], checked as boolean)}
                className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
              <Label htmlFor={`doc-${key}`}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</Label>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="rines" className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="estado-rines"
              checked={data.rinesYllantas.estadoRines}
              onCheckedChange={(checked) => handleRinesLlantasChange("estadoRines", checked)}
              className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
            />
            <Label htmlFor="estado-rines">Estado de los rines conforme</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="estado-llantas"
              checked={data.rinesYllantas.estadoLlantas}
              onCheckedChange={(checked) => handleRinesLlantasChange("estadoLlantas", checked)}
              className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
            />
            <Label htmlFor="estado-llantas">Estado de las llantas conforme</Label>
          </div>

          {[0, 1, 2, 3].map((index) => (
            <div key={`llanta-${index}`} className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`labrado-${index}`}>Labrado Llanta N° {index + 1}</Label>
                <Input
                  id={`labrado-${index}`}
                  type="text"
                  value={data.rinesYllantas.labrado[index] || ""}
                  onChange={(e) => {
                    const newLabrado = [...data.rinesYllantas.labrado]
                    newLabrado[index] = e.target.value
                    handleRinesLlantasChange("labrado", newLabrado)
                  }}
                  placeholder="0,00"
                />
              </div>
              <div>
                <Label htmlFor={`presion-${index}`}>Presión de aire Llanta N° {index + 1}</Label>
                <Input
                  id={`presion-${index}`}
                  type="text"
                  value={data.rinesYllantas.presion[index] || ""}
                  onChange={(e) => {
                    const newPresion = [...data.rinesYllantas.presion]
                    newPresion[index] = e.target.value
                    handleRinesLlantasChange("presion", newPresion)
                  }}
                  placeholder="0,00"
                />
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

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