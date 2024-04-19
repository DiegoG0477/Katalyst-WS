import { Server, Socket } from 'socket.io';

/**
 * Class representing a WebSocket handler.
 */
export class WebSocketHandler {
  private packetBuffer: any[] = [];
  private isProcessing = false;

  /**
   * Creates an instance of WebSocketHandler.
   * @param {Server} io - The Socket.IO server instance.
   */
  constructor(private io: Server) {
    this.io.on('connection', this.handleConnection);
  }

  /**
   * Handles the connection event for a WebSocket client.
   * @param {Socket} socket - The Socket.IO socket instance.
   */
  private handleConnection = (socket: Socket) => {
    console.log('Client connected.');

    socket.on('data:medical', (data) => {
      this.enqueuePacket({ event: 'data:medical', data });
      this.processNextPacket();
    });
  };

  /**
   * Enqueues a packet to the packet buffer.
   * @param {any} packet - The packet to enqueue.
   */
  private enqueuePacket(packet: any) {
    this.packetBuffer.push(packet);
  }

  /**
   * Processes the next packet in the packet buffer.
   */
  private processNextPacket() {
    if (this.packetBuffer.length > 0 && !this.isProcessing) {
      this.isProcessing = true;
      const packet = this.packetBuffer.shift();
      this.handlePacket(packet);
    } else {
      this.isProcessing = false;
    }
  }

  /**
   * Handles a packet by emitting the event and data to all connected clients.
   * @param {any} packet - The packet to handle.
   */
  private handlePacket(packet: any) {
    const { event, data } = packet;
    console.log(`Processing event ${event} with data:`, data);
    this.io.emit(event, data);
    this.isProcessing = false;
    this.processNextPacket(); 
  }
}
