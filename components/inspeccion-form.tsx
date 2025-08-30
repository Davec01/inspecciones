"use client"

import { useState } from "react"
import { InformacionGeneral } from "./steps/informacion-general"
import { VerificacionElementos } from "./steps/verificacion-elementos"
import { EvidenciaFotografica } from "./steps/evidencia-fotografica"
import { ResumenFinal } from "./steps/resumen-final"
import { ProgressBar } from "./ui/progress-bar"

export interface VehicleData {
  conductor: string;
  contrato: string;
  responsableJefe: string;
  vehiculo: string;
  numeroInterno: string;
  odometro: string;

  documentos: {
    licenciaConduccion: boolean;
    licenciaTransito: boolean;
    soat: boolean;
    revisionTecnoMecanica: boolean;
    extractoContrato: boolean;
    tarjetaOperacion: boolean;
  };

  rinesYllantas: {
    estadoRines: boolean;
    estadoLlantas: boolean;
    labrado: string[]; // 4 elementos
    presion: string[]; // 4 elementos
  };

  fotos: {
    frontal: string | null;
    lateral: string | null;
    trasera: string | null;
    interior: string | null;
  };
}

const initialData: VehicleData = {
  conductor: "",
  contrato: "",
  responsableJefe: "",
  vehiculo: "",
  numeroInterno: "",
  odometro: "",

  documentos: {
    licenciaConduccion: false,
    licenciaTransito: false,
    soat: false,
    revisionTecnoMecanica: false,
    extractoContrato: false,
    tarjetaOperacion: false,
  },

  rinesYllantas: {
    estadoRines: false,
    estadoLlantas: false,
    labrado: ["", "", "", ""],
    presion: ["", "", "", ""],
  },

  fotos: {
    frontal: null,
    lateral: null,
    trasera: null,
    interior: null,
  },
};


export function InspeccionForm() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<VehicleData>(initialData)

  const updateData = (newData: Partial<VehicleData>) => {
    setData((prev) => ({ ...prev, ...newData }))
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  const handleSubmit = () => {
    console.log("Datos enviados:", data)
    // Aquí se enviarían los datos a un servidor
    alert("Inspección completada con éxito")
    setData(initialData)
    setStep(1)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#0288d1] text-white p-4 text-center">
          <h1 className="text-xl font-bold">Inspección Preoperacional</h1>
        </div>

        <ProgressBar currentStep={step} totalSteps={4} />

        <div className="p-4">
          {step === 1 && <InformacionGeneral data={data} updateData={updateData} onNext={nextStep} />}

          {step === 2 && (
            <VerificacionElementos data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} />
          )}

          {step === 3 && (
            <EvidenciaFotografica data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} />
          )}

          {step === 4 && <ResumenFinal data={data} onSubmit={handleSubmit} onPrev={prevStep} />}
        </div>
      </div>
    </div>
  )
}
