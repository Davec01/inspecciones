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
      labrado: string[]; // [llanta1, llanta2, llanta3, llanta4]
      presion: string[]; // [llanta1, llanta2, llanta3, llanta4]
    };
  
    fotos: {
      frontal: string | null;
      lateral: string | null;
      trasera: string | null;
      interior: string | null;
    };
  }
  