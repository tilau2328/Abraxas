import * as io from 'socket.io-client';

export abstract class SocketConnector {
    private socket: SocketIOClient.Socket;
    private handlers: { [event: string]: (data: any) => void } = {};

    abstract onReconect(socket: SocketIOClient.Socket): void;

    get hasSocket() {
        return !!this.socket;    
    }

    protected connect(url: string) {
        this.socket = io(url);
        this.socket.on('reconnect', () => this.onReconect(this.socket));
    }

    protected emit(event: string, data: any) {
        this.socket.emit(event, data);
    }

    protected registerEventHandlers() {
        
        
    }

    protected registerEventHandler(event: string, handler: (data: any) => void) {
        this.socket.on(event, handler);
        this.handlers[event] = handler;
    }

    protected unregisterEventHandler(event: string) {
        const handler = this.handlers[event];
        if(!handler) return;
        this.socket.removeListener(event, handler);
        this.handlers.remove(event);
    }

    protected unregisterEventHandlers() {
        for(let event in this.handlers)
            this.unregisterEventHandler(event);
    }
} 