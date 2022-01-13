"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = void 0;
function getEvents(response, tag) {
    var filteredEvents = response.data[tag].filter(function (item) { return item.tag !== 'added'; });
    return filteredEvents.map(function (item) {
        var evento = {
            status: item.events,
            data: item.date.replace(/ (.)+/g, ''),
            hora: item.date.replace(/(.)+ /g, '').slice(0, -3),
            origem: "".concat(item.local, " - ").concat(item.city || '', " / ").concat(item.uf || ''),
            local: "".concat(item.local, " - ").concat(item.city || '', " / ").concat(item.uf || ''),
        };
        if (item.destination_local) {
            evento.destino = "".concat(item.destination_local, " - ").concat(item.destination_city, " / ").concat(item.destination_uf);
        }
        return evento;
    });
}
exports.getEvents = getEvents;
//# sourceMappingURL=getEvents.js.map