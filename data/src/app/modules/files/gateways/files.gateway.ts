import { WebSocketGateway, SubscribeMessage, WsResponse, WebSocketServer, OnGatewayInit, WsException, OnGatewayConnection } from "@nestjs/websockets";
import { AuthService } from "../../core/services/auth.service";
import { createClient, RedisClient } from 'redis';
import { Observable } from 'rxjs/Observable';
import { UseGuards } from "@nestjs/common";

@WebSocketGateway({ namespace: 'files' })
export class FilesGateway implements OnGatewayInit {
    @WebSocketServer() server;
    private pubsub: RedisClient;
    private events: Observable<WsResponse<any>>;
    
    constructor(
        private readonly authService: AuthService,
    ) {}

    afterInit() {
        this.pubsub = createClient();
        this.pubsub.subscribe("files");
        this.events = Observable.create((observer) => {
            this.pubsub.on('message', (channel, message) => {
                try {
                    console.log(message);
                    observer.next(JSON.parse(message)); 
                } catch(err) {
                    console.log(err);
                }
            });
        });
    }

    @SubscribeMessage('folder')
    folder(client, { token, id }): Observable<WsResponse<any>> {
        try {
            return Observable.create(async (observer) => {
                const user = await this.authService.validateToken(token);
                if(!user) throw new WsException("Sir, I need your ID");
                this.events.filter(({ event, data }) => data.owner === user.id && ((event.includes("folder") && data.id == id) || (data.directory == id || (!data.directory && !id))))
                    .subscribe((event) => observer.next(event));
            });
        } catch(err) {
            client.close();
            console.log("error", err);
        }
    }

    @SubscribeMessage('file')
    file(client, { token, id }): Observable<WsResponse<any>> {
        try {
            if(!id) throw new WsException("Sir, I need the file ID");
            return Observable.create(async (observer) => {
                const user = await this.authService.validateToken(token);
                if(!user) throw new WsException("Sir, I need your ID");
                this.events.filter(({ event, data }) => data.owner === user.id && event.includes("file") && data.id === id)
                    .subscribe(event => observer.next(event));
            });
        } catch(err) {
            client.close();
            console.log(err);
        }
    }
}
