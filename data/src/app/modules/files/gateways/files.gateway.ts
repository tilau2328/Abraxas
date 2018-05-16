import { WebSocketGateway, SubscribeMessage, WsResponse, WebSocketServer, OnGatewayInit, WsException, OnGatewayConnection } from "@nestjs/websockets";
import { AuthService } from "../../core/services/auth.service";
import { createClient, RedisClient } from 'redis';
import { Observable } from 'rxjs/Observable';
import { UseGuards } from "@nestjs/common";
import { Observer } from "rxjs/Observer";
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeWhile';

@WebSocketGateway({ namespace: 'files' })
export class FilesGateway implements OnGatewayInit {
    @WebSocketServer() server;
    private pubsub: RedisClient;
    private events: Subject<WsResponse<any>>;
    private subscriptions: { [user: string]: string } = {};
    constructor(
        private readonly authService: AuthService,
    ) {}

    afterInit() {
        this.events = new Subject();
        this.pubsub = createClient();
        this.pubsub.subscribe("files");
        this.pubsub.on('message', (channel, message) => {
            try {
                console.log("Message");
                this.events.next(JSON.parse(message)); 
            } catch(err) {
                console.log("Err: ", err);
            }
        });
    }

    @SubscribeMessage('folder')
    async folder(client, { token, id }): Promise<Observable<WsResponse<any>>> {
        try {
            const user = await this.authService.validateToken(token);
            if(!user) throw new WsException("Sir, I need your ID");
            return this.events.asObservable()
                .takeWhile(() => client.connected)
                .filter(({ event, data }) => data.owner === user.id && 
                    ((event.includes("folder") && data.id == id) || 
                    (data.directory == id || (!data.directory && !id))));
        } catch(err) {
            client.close();
            console.log("error: ", err);
        }
    }

    @SubscribeMessage('file')
    async file(client, { token, id }): Promise<Observable<WsResponse<any>>> {
        try {
            if(!id) throw new WsException("Sir, I need the file ID");
            const user = await this.authService.validateToken(token);
            if(!user) throw new WsException("Sir, I need your ID");
            return this.events.asObservable()
                .takeWhile(() => client.connected)
                .filter(({ event, data }) => data.owner === user.id && 
                    event.includes("file") && data.id === id);
        } catch(err) {
            client.close();
            console.log(err);
        }
    }
}
