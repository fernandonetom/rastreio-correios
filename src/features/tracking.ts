import { LinkCorreiosService } from '../services/LinkCorreios.service';
import { MelhorEnvioService } from '../services/MelhorEnvio.service';
import { siglas } from '../utils/siglasDatabase';

interface RastreioResult {
  sucesso: boolean;
  rastreio: string;
  responseTime: number;
  mensagem?: string;
  entregue?: boolean;
  eventos?: RastreioEvent[];
  type?: string;
}

interface RastreioEvent {
  status: string;
  data: string;
  hora: string;
  origem?: string;
  destino?: string;
  local?: string;
}

/**
 * Rastreia um ou mais códigos de rastreio
 * @param {string} Códigos
 * @returns {promise}
 */

export async function Tracking(
  rastreios: string | string[]
): Promise<RastreioResult[]> {
  let lista: string[] = [];

  if (typeof rastreios === 'string') {
    lista.push(rastreios);
  } else {
    lista = [...rastreios];
  }

  const result: RastreioResult[] = [];

  await Promise.all(
    lista.map(async (rastreio) => {
      const start = new Date().getTime();
      try {
        const response = await Promise.any([
          MelhorEnvioService(lista[0]),
          LinkCorreiosService(lista[0]),
        ]);

        const responseTime = new Date().getTime() - start;

        let entregue = false;

        const type = siglas[rastreio.slice(0, 2)] || 'Não identificado';

        if (response.service === 'melhorEnvio') {
          result.push({
            sucesso: true,
            rastreio,
            eventos: response.data.events.map((item) => {
              const evento: RastreioEvent = {
                status: item.events,
                data: item.date.replace(/ (.)+/g, ''),
                hora: item.date.replace(/(.)+ /g, '').slice(0, -3),
                origem: `${item.local} - ${item.city || ''} / ${item.uf || ''}`,
                local: `${item.local} - ${item.city || ''} / ${item.uf || ''}`,
              };

              if (item.destination_local) {
                evento.destino = `${item.destination_local} - ${item.destination_city} / ${item.destination_uf}`;
              }

              if (item.events.toLowerCase().includes('entregue'))
                entregue = true;

              return evento;
            }),
            responseTime,
            entregue,
            type,
          });
        } else {
          result.push({
            sucesso: true,
            rastreio,
            eventos: response.data.events.map((item) => {
              const evento: RastreioEvent = {
                status: item.status,
                data: item.data,
                hora: item.hora,
                local: item.local,
              };

              if (item.destino) {
                evento.local = item.origem.replace(/(.)+ - /g, '');
                evento.destino = item.destino;
                evento.origem = item.origem;
              }

              if (item.status.toLowerCase().includes('entregue'))
                entregue = true;

              return evento;
            }),
            responseTime,
            entregue,
            type,
          });
        }

        return;
      } catch (error) {
        const responseTime = new Date().getTime() - start;
        result.push({
          sucesso: false,
          rastreio,
          mensagem: error.message,
          responseTime,
        });
      }
    })
  );

  return result;
}
