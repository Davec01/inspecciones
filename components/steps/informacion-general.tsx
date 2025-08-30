// components/steps/informacion-general.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { VehicleData } from "../inspeccion-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getTelegramIdFallback } from "../../utils/telegram";

type ApiResp = {
  responsable: string | null;
  persona?: string | null;
  contratos: Array<{
    contrato: string;
    responsable?: string; // <-- AHORA VIENE AQUÍ
    vehiculos: Array<{ id: number; numeroInterno: string; vehiculo: string; odometro?: number; empleado?: string }>;
  }>;
  message?: string;
};

interface InformacionGeneralProps {
  data: VehicleData;
  updateData: (data: Partial<VehicleData>) => void;
  onNext: () => void;
}

export function InformacionGeneral({ data, updateData, onNext }: InformacionGeneralProps) {
  const [lista, setLista] = useState<ApiResp | null>(null);
  const [selectedContrato, setSelectedContrato] = useState<string>("");

  useEffect(() => {
    const tgId = getTelegramIdFallback();
    if (!tgId) return;

    (async () => {
      try {
        const r1 = await fetch(`/api/usuario?telegram_id=${encodeURIComponent(tgId)}`);
        const j1 = await r1.json();
        const nombre = (j1?.nombre || "").trim();
        if (!nombre) return;

        if (!data.conductor) updateData({ conductor: nombre });

        let r2 = await fetch(`/api/vehiculos-por-responsable?responsable=${encodeURIComponent(nombre)}`);
        let j2: ApiResp = await r2.json();

        if (!j2?.contratos?.length) {
          r2 = await fetch(`/api/vehiculos-por-responsable?persona=${encodeURIComponent(nombre)}`);
          j2 = await r2.json();
        }

        if (j2?.contratos?.length) {
          setLista(j2);

          const c0 = j2.contratos[0];
          if (!data.contrato && c0) {
            setSelectedContrato(c0.contrato);

            // Autollenar responsable si está vacío usando el responsable del contrato
            if (!data.responsableJefe && c0.responsable) {
              updateData({ responsableJefe: c0.responsable });
            }

            const v0 = c0.vehiculos?.[0];
            updateData({
              contrato: c0.contrato,
              numeroInterno: v0?.numeroInterno ?? "",
              vehiculo: v0?.vehiculo ?? "",
              odometro: v0?.odometro ? String(v0.odometro) : data.odometro,
              conductor: data.conductor || nombre, // no tocar
            });
          }
        }
      } catch (e) {
        console.error("Autocompletado:", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vehiculosDelContrato = useMemo(() => {
    if (!lista || !selectedContrato) return [];
    const bucket = lista.contratos.find((c) => c.contrato === selectedContrato);
    return bucket?.vehiculos ?? [];
  }, [lista, selectedContrato]);

  const handleSelectContrato = (value: string) => {
    setSelectedContrato(value);

    // actualizar responsableJefe según contrato seleccionado
    const contratoSel = lista?.contratos.find((c) => c.contrato === value);
    if (contratoSel?.responsable) {
      updateData({ responsableJefe: contratoSel.responsable });
    }

    // limpiar vehículo / número
    updateData({ contrato: value, vehiculo: "", numeroInterno: "" });
  };

  const handleSelectVehiculo = (value: string) => {
    const [nint] = value.split("|");
    const veh = vehiculosDelContrato.find((v) => v.numeroInterno === nint);
    if (veh) {
      updateData({
        numeroInterno: veh.numeroInterno,
        vehiculo: veh.vehiculo,
        odometro: veh.odometro ? String(veh.odometro) : data.odometro,
        // conductor NO se toca
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-4">Información General</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="conductor">Conductor:</Label>
          <Input
            id="conductor"
            value={data.conductor}
            onChange={(e) => updateData({ conductor: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="responsableJefe">Responsable Jefe:</Label>
          <Input
            id="responsableJefe"
            value={data.responsableJefe}
            onChange={(e) => updateData({ responsableJefe: e.target.value })}
            required
          />
        </div>

        {lista?.contratos?.length ? (
          <>
            <div>
              <Label htmlFor="contrato">Contrato:</Label>
              <select
                id="contrato"
                className="border rounded-md w-full h-10 px-2"
                value={selectedContrato}
                onChange={(e) => handleSelectContrato(e.target.value)}
              >
                {lista.contratos.map((c) => (
                  <option key={c.contrato} value={c.contrato}>
                    {c.contrato}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="vehiculoSelect">Vehículo / Nº Interno:</Label>
              <select
                id="vehiculoSelect"
                className="border rounded-md w-full h-10 px-2"
                value={data.numeroInterno ? `${data.numeroInterno}|${data.vehiculo}` : ""}
                onChange={(e) => handleSelectVehiculo(e.target.value)}
              >
                <option value="" disabled>Selecciona un vehículo…</option>
                {vehiculosDelContrato.map((v) => (
                  <option key={v.numeroInterno} value={`${v.numeroInterno}|${v.vehiculo}`}>
                    Nº {v.numeroInterno} — {v.vehiculo}{v.odometro ? ` (odómetro: ${v.odometro})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="contrato">Contrato:</Label>
              <Input
                id="contrato"
                value={data.contrato}
                onChange={(e) => updateData({ contrato: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="vehiculo">Vehículo:</Label>
              <Input
                id="vehiculo"
                value={data.vehiculo}
                onChange={(e) => updateData({ vehiculo: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="numeroInterno">Número Interno:</Label>
              <Input
                id="numeroInterno"
                value={data.numeroInterno}
                onChange={(e) => updateData({ numeroInterno: e.target.value })}
                required
              />
            </div>
          </>
        )}

        <div>
          <Label htmlFor="odometro">Odómetro:</Label>
          <Input
            id="odometro"
            value={data.odometro}
            onChange={(e) => updateData({ odometro: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button type="submit">Siguiente →</Button>
      </div>
    </form>
  );
}
