/// <reference path="../../typings/angularjs/angular.d.ts" />  
/// <reference path="../../typings/stomp/stomp.d.ts" />
/// <reference path="../../typings/sockjs/sockjs.d.ts" />
/// <reference path="./util-rootscope.ts" />

module util.webSocket {
    
    export interface IWebSocketService {
        subscribe(url: string, handler: (message: StompMessage) => any, keepActive?: boolean);
        clearSubscriptions(): void;
    }
    
    export interface IWebSocketMessage {
        messageObject : any;
    } 

    
    export class WebSocketSuscriber
    {
        constructor(public url: string, public handler: (message : StompMessage) => any, public keepActive: boolean) {
        }
    }

    export class WebSocketService implements IWebSocketService {
        
        static socket: SockJS;
        static stompClient: Client;
        static subscribers : WebSocketSuscriber[] = [];
        static subscriptions : Subscription[] = [];

        private originDebug : () => void;
        
        //appConf is a constant
        static $inject = [
            'appConf', 
            '$rootScope', 
            '$log',
            '$timeout',
        ];

        constructor(
            private appConf: any, 
            private $rootScope: util.rootscope.IRootScopeProcessworks, 
            private $log: ng.ILogService,
            private $timeout : ng.ITimeoutService, 
        ) {
            this.initWebSocketClient();
            this.originDebug = WebSocketService.stompClient.debug;
            this.debugEnabled(false);
        }
        
        // Init web socket client in static property.
        
        private initWebSocketClient(): void {
            if (!WebSocketService.socket) {

                this.$log.info("Init Web Socket : "+this.appConf.webSocketEndpointUrl);
                WebSocketService.socket = new SockJS(this.appConf.webSocketEndpointUrl.toString());
                WebSocketService.stompClient = Stomp.over(WebSocketService.socket);
                WebSocketService.stompClient.connect({}, function(frame) { });
                
                // When the socket is opened, we send the subscriptions.
                WebSocketService.socket.onopen = (ev: SJSOpenEvent) => { 
                    this.$log.info("Socket connected : run subscribers");
                    
                    // Throw an event
                    this.$rootScope.$broadcast('openSocketConnexion');
                    
                    WebSocketService.subscribers.forEach((s : WebSocketSuscriber) =>{
                        this.$log.info("New SUBSCRIPTION : " + s.url);
                        let sub = WebSocketService.stompClient.subscribe(s.url, s.handler);
                        if (s.keepActive === undefined || !s.keepActive) {
                            sub.id = s.url;
                            WebSocketService.subscriptions.push(sub);
                        }
                    });
                };
                
                // When the socket is opened, we send the subscriptions.
                WebSocketService.socket.onclose = (ev: SJSOpenEvent) => { 
                    this.$log.info("Socket closed");
                    
                   // Throw an event
                   this.$rootScope.$broadcast('lostSocketConnexion');
                   
                   //Retry
                   WebSocketService.socket = null;
                   this.$timeout(()=>{this.initWebSocketClient()},10000);
                };
            }
        }

        //If socket connection is established, the subscribe are executed. Else
        //the subscriptions are stored in a list and executed when the connection is opened.
        subscribe(url: string, handler: (message: StompMessage) => any, keepActive?: boolean): boolean {
             
            //CLOSE
            if (WebSocketService.socket.readyState === 1) {
                let sub = WebSocketService.stompClient.subscribe(url, handler);
                if (keepActive === undefined || !keepActive) {
                    sub.id = url;
                    WebSocketService.subscriptions.push(sub);
                }
            }
            //CONNECTING
            else if (WebSocketService.socket.readyState === 0) {
                WebSocketService.subscribers.push(new WebSocketSuscriber(url,handler,keepActive));
            }
            else {
                return false;
            }
            return true;
        }
        
        clearSubscriptions(): void {
            WebSocketService.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
        }

        debugEnabled(enabled: boolean): void {
            if(!enabled) {
                WebSocketService.stompClient.debug = () => {};
            }
            else {
                WebSocketService.stompClient.debug = this.originDebug;
            }
        }

    }

    angular.module('util').service('utilWebSocketService', WebSocketService);
}    
