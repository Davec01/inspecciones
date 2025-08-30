"use client";

import type { VehicleData } from "../inspeccion-form";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ResumenFinalProps {
  data: VehicleData;
  onSubmit: () => void;
  onPrev: () => void;
}

export function ResumenFinal({ data, onSubmit, onPrev }: ResumenFinalProps) {
  const fotosSubidas = Object.values(data.fotos).filter(Boolean).length;

  const handleComplete = async () => {
    try {
      if (!data.numeroInterno || !data.odometro || !data.contrato || !data.conductor) {
        alert("Faltan campos obligatorios (número interno, odómetro, contrato o conductor)");
        return;
      }

      const transformedData = {
        contrato: data.contrato,
        conductor: data.conductor,
        vehiculo: data.vehiculo,
        numeroInterno: data.numeroInterno,
        odometro: data.odometro,
        responsableJefe: data.responsableJefe,
        documentos: data.documentos,
        rinesYllantas: data.rinesYllantas,
        fotos: {
          frontal: data.fotos.frontal ?? null,
          lateral: data.fotos.lateral ?? null,
          trasera: data.fotos.trasera ?? null,
          interior: data.fotos.interior ?? null,
        },
      };

      // 🔄 Enviar los datos al backend para almacenarlos en PostgreSQL
      const res = await fetch("/api/guardar-inspeccion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transformedData),
      });

      if (!res.ok) throw new Error("Error al guardar en PostgreSQL");

      onSubmit();
    } catch (error) {
      alert("Ocurrió un error al guardar la inspección.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Resumen de la Inspección</h2>

      <div className="space-y-4">
        {/* Información General */}
        <div className="bg-gray-50 p-3 rounded-md">
          <h3 className="font-medium">Información General</h3>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <Info label="Conductor" value={data.conductor} />
            <Info label="Contrato" value={data.contrato} />
            <Info label="Responsable Jefe" value={data.responsableJefe} />
            <Info label="Vehículo" value={data.vehiculo} />
            <Info label="Número Interno" value={data.numeroInterno} />
            <Info label="Odómetro" value={data.odometro} />
          </div>
        </div>

        {/* Documentos */}
        <Section title="Documentos del Vehículo">
          <ul className="list-disc pl-5 text-sm mt-2">
            {Object.entries(data.documentos).map(([key, value]) => (
              <li key={key} className="flex items-center justify-between">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                {value ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </li>
            ))}
          </ul>
        </Section>

        {/* Rines y Llantas */}
        <Section title="Rines y Llantas">
          <Feature label="Estado de Rines" isValid={data.rinesYllantas.estadoRines} />
          <Feature label="Estado de Llantas" isValid={data.rinesYllantas.estadoLlantas} />

          <div className="mt-3 text-sm">
            <h4 className="font-medium mb-1">Labrado de Llantas</h4>
            {data.rinesYllantas.labrado.map((valor, idx) => (
              <div key={idx}>Llanta {idx + 1}: {valor || "-"}</div>
            ))}

            <h4 className="font-medium mt-3 mb-1">Presión de Aire</h4>
            {data.rinesYllantas.presion.map((valor, idx) => (
              <div key={idx}>Llanta {idx + 1}: {valor || "-"}</div>
            ))}
          </div>
        </Section>

        {/* Fotos */}
        <Section title="Evidencia Fotográfica">
          <div className="flex items-center justify-between mt-2">
            <div className="text-sm">Fotos subidas:</div>
            <div className="flex items-center">
              <span className="font-medium mr-1">{fotosSubidas}/4</span>
              {fotosSubidas > 0 ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-2">
            {Object.entries(data.fotos).map(([key, value]) =>
              value ? (
                <div key={key} className="relative">
                  <img
                    src={value || "/placeholder.svg"}
                    alt={key}
                    className="w-full h-12 object-cover rounded-sm"
                  />
                </div>
              ) : null
            )}
          </div>
        </Section>
      </div>

      {/* Botones */}
      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onPrev}>
          ← Atrás
        </Button>
        <Button type="button" onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
          Completar Inspección
        </Button>
      </div>
    </div>
  );
}

// 🧩 Componentes auxiliares

const Info = ({ label, value }: { label: string; value: string | undefined }) => (
  <>
    <div>{label}:</div>
    <div className="font-medium">{value || "No especificado"}</div>
  </>
);

const Feature = ({ label, isValid }: { label: string; isValid: boolean }) => (
  <div className="flex items-center justify-between text-sm mt-2">
    <div>{label}:</div>
    {isValid ? (
      <CheckCircle2 className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    )}
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-gray-50 p-3 rounded-md">
    <h3 className="font-medium">{title}</h3>
    {children}
  </div>
);
