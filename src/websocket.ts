import * as WebSocket from 'ws';
import { Request, NextFunction } from 'express';
import { RPCLightningNetworkClient, InvoiceStreamingMessage } from './lightning-rpc-client';

export type MessageType = 'update' | 'snapshot' | 'fill' | 'keepalive';
export type ChannelType = 'orderbook' | 'keepalive';
export interface WebSocketMessage<T extends Object> {
  type: MessageType;
  channel: ChannelType;
  channelId?: number;
  payload: T;
}

interface ConnectionContext {
  socket: WebSocket;
  initialized: boolean;
  subscriptions: Array<string>;
  subscriptionCount: number;
  subscriptionIdMap: Map<string, number>;
}

export class WebSocketNode {
  private wsServerRef: WebSocket.Server;
  private lnClient: RPCLightningNetworkClient;

  private connections: Set<ConnectionContext>;
  constructor({ wss, lnClient }: { wss: WebSocket.Server; lnClient: RPCLightningNetworkClient }) {
    this.wsServerRef = wss;
    this.lnClient = lnClient;

    this.connections = new Set();
    lnClient.on('ln.subscribeInvoices.data', (msg: InvoiceStreamingMessage) => {
      console.log('websocket server, message received from rpc client', msg);
      this.onInvoiceUpdate(msg);
    });

    this.log('verbose', `WebSocket node subscribed to LN Client subscription updates`);
    // const orderAddedSubId = this.subscriber.subscribe(
    //   ORDER_ADDED,
    //   (payload: OrderEvent<OrderAdded>) => {
    //     this.log('verbose', `Received message from redis for added order`);
    //     this.onOrderAddOrUpdateEvent(payload);
    //   }
    // );
    // this.log('verbose', `WebSocket node subscribing to ORDER_UPDATED message channel`);
    // const orderUpdateSubId = this.subscriber.subscribe(
    //   ORDER_UPDATED,
    //   (payload: OrderEvent<OrderUpdated>) => {
    //     this.log('verbose', `Received message from redis for updated order`);
    //     this.onOrderAddOrUpdateEvent(payload);
    //   }
    // );
  }

  public async connectionHandler(
    socket: WebSocket,
    req: Request,
    next: NextFunction
  ): Promise<void> {
    this.log('verbose', 'WebSocket client connected to WebSocket Server');
    const connectionContext: ConnectionContext = {
      socket,
      subscriptions: [],
      initialized: false,
      subscriptionCount: 0,
      subscriptionIdMap: new Map(),
    };
    socket.on('error', err => this.log('error', JSON.stringify(err)));
    socket.on('close', this.handleDisconnectFromClientSocket(connectionContext));
    socket.on('message', this.onMessageFromClientSocket(connectionContext));
    this.connections.add(connectionContext);
  }

  private onInvoiceUpdate(invoicePayReceipt: InvoiceStreamingMessage) {
    console.log('inside invoice update websocket', invoicePayReceipt);
    const { id } = JSON.parse(invoicePayReceipt.memo);
    console.log('foudn payment for ', id);

    if (!id) {
      console.log(`id not found inside memo`);
      return;
    }
    const subscriptionChannel = `${id}`;
    this.connections.forEach(connection => {
      if (connection.subscriptions.find(s => s === subscriptionChannel)) {
        const channelId = connection.subscriptionIdMap.get(subscriptionChannel) || 0;
        const message: WebSocketMessage<any> = {
          type: 'update',
          channel: 'orderbook',
          channelId,
          payload: invoicePayReceipt,
        };
        this.sendMessage(connection, message);
      }
    });
  }

  private onMessageFromClientSocket(connectionContext: ConnectionContext) {
    return (message: any) => {
      // initialize
      if (!connectionContext.initialized) {
        this.sendKeepAlive(connectionContext);
        const keepAliveTimer = setInterval(() => {
          if (connectionContext.socket.readyState === WebSocket.OPEN) {
            this.sendKeepAlive(connectionContext);
          } else {
            clearInterval(keepAliveTimer);
            if (this.connections.has(connectionContext)) {
              this.log('debug', 'Keepalive found a stale connection, removing');
              this.handleDisconnectFromClientSocket(connectionContext);
            }
          }
        }, 20000);
        connectionContext.initialized = true;
      }

      this.log('verbose', 'WebSocket server received message from a client WebSocket', message);
      let data = { type: 'unknown' };
      try {
        data = JSON.parse(message.toString());
      } catch {
        data = message;
      }
      switch (data.type) {
        case 'subscribe':
          this.log('debug', `WebSocket subscribe request received`);
          const subscribeRequest = data as WebSocketMessage<any>;
          this.handleSubscriptionRequest(connectionContext, subscribeRequest);
          break;
        default:
          this.log(
            'debug',
            `Unrecognized message type ${data.type} received from client websocket`
          );
          break;
      }
    };
  }

  private handleDisconnectFromClientSocket(context: ConnectionContext) {
    return (code: number, reason: string) => {
      this.log('verbose', `WebSocket connection closed with code ${code}`, reason) ||
        this.connections.delete(context);
    };
  }

  private handleSubscriptionRequest(
    context: ConnectionContext,
    subscriptionRequest: WebSocketMessage<any>
  ) {
    const { channel, type, payload } = subscriptionRequest;
    const { id } = payload;
    const subscriptionChannel = id;
    const channelId = context.subscriptionCount++;
    context.subscriptionIdMap.set(subscriptionChannel, channelId);
    context.subscriptions.push(subscriptionChannel);
  }

  private sendKeepAlive(connectionContext: ConnectionContext): void {
    this.sendMessage(connectionContext, { type: 'keepalive', channel: 'keepalive', payload: {} });
  }

  private sendMessage(connectionContext: ConnectionContext, message: WebSocketMessage<any>): void {
    if (message && connectionContext.socket.readyState === WebSocket.OPEN) {
      connectionContext.socket.send(JSON.stringify(message));
    }
  }

  private log(level: string, message: string, meta?: any) {
    console.log(level, message, ...meta);
    // if (!this.logger) {
    //   return;
    // }
    // this.logger.log(level, message, meta);
  }
}
