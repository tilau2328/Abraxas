import * as io from 'socket.io-client';

let connections: { [ns: string]: SocketIOClient.Socket } = {};

export function createSocket(ns?: string): SocketIOClient.Socket {
    if(!!connections[ns]) return connections[ns];
    let url = 'http://localhost:3000';
    if(!!ns) url += ns;
    const socket = io(url);
    connections[ns] = socket; 
    return socket;
}