import { RastreioEvent } from '../interfaces/rastreio';

export function getEvents(response, tag) {
  const filteredEvents = response.data[tag].filter(
    (item) => item.tag !== 'added'
  );

  return filteredEvents.map((item) => {
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

    return evento;
  });
}
