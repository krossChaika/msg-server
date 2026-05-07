import { Socket } from 'socket.io';

export type SocketMessage = 'create-new-message'
    | 'delete-message'
    | 'send-friend-request'
    | 'receive-friend-request'
    | 'decide-friend-request'
    | 'accepted-friend-request'
    | 'declined-friend-request'
    | 'create-server'
    | 'join-server'
    | 'create-chat'
    | 'create-channel';

export type UserId = string;

export type Connection = {
    userId: UserId;
    socket: Socket;
}

export class ConnectionsPool {
    connectionsByUserId: Map<string, Connection> = new Map();
    connectionsBySocketId: Map<string, Connection> = new Map();
    
    get(userId: string) {
        const result = this.connectionsByUserId.get(userId);
        if (!result) throw new Error(`Connection with userId ${userId} not found`);
        return result;
    }
    
    set(userId: string, connection: Connection) {
        this.connectionsByUserId.set(userId, connection);
    }
    
    getBySocketId(socketId: string) {
        const result = this.connectionsBySocketId.get(socketId);
        if (!result) throw new Error(`Connection with socketId ${socketId} not found`);
        return result;
    }
    
    delete(client: Socket) {
        const userId = client.handshake.headers.authorization;
        
        if (userId) {
            this.connectionsByUserId.delete(userId);
        }
        
        // this.connectionsBySocketId.delete(client.id);
    }
    
    emitToUser(userId: string, messageType: SocketMessage, data: any) {
        this.connectionsByUserId.get(userId)?.socket.emit(messageType, data);
    }
    
    emitToUsers(userIds: string[], messageType: SocketMessage, data: any) {
        userIds.forEach((userId) => {
            this.connectionsByUserId.get(userId)?.socket.emit(messageType, data);
        });
    }
}