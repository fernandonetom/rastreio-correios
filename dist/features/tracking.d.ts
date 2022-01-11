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
export declare function Tracking(rastreios: string | string[]): Promise<RastreioResult[]>;
export {};
