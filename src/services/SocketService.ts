import io from 'socket.io-client';
import * as Config from 'config/config';
// import SocketIOFileClient from 'socket.io-file-client';

interface SocketResponse<T = any> {
  hasData: boolean;
  hasError: boolean;
  data?: T;
  error?: string;
}

export default class SocketService {

  socket: SocketIOClient.Socket | null;
  uploader: any | null;

  constructor() {
    this.socket = null;
  }

  connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!!this.socket && this.socket.connected) return resolve();
      this.socket = io.connect(Config.SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
      });
      // this.uploader = new SocketIOFileClient(this.socket);
      // this.uploader.on('start', function (fileInfo: any) {
      //   console.log('Start uploading', fileInfo);
      // });
      // this.uploader.on('stream', function (fileInfo: any) {
      //   console.log('Streaming... sent ' + fileInfo.sent + ' bytes.');
      // });
      // this.uploader.on('complete', function (fileInfo: any) {
      //   console.log('Upload Complete', fileInfo);
      // });
      // this.uploader.on('error', function (err: any) {
      //   console.log('Error!', err);
      // });
      // this.uploader.on('abort', function (fileInfo: any) {
      //   console.log('Aborted: ', fileInfo);
      // });
      this.socket?.on('connect', (): void => resolve());
      this.socket?.on('connect_error', (error: any): void => reject(error));
    });
  }

  disconnect(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.socket?.disconnect();
      this.socket = null;
      resolve();
    });
  }

  emit<T = void>(event: string, data: any, timeout: number = 500000) {
    // console.log(event)
    return new Promise<T>(async (resolve, reject) => {
      await this.connect();
      if (!this.socket)
        return reject('No socket connection.');
      // if (this.socket.disconnected) return reject('Socket is disconnected.');
      let called = false;
      const timer = setTimeout(() => {
        if (called)
          return;
        called = true;
        console.error(`The operation "${event}" timed out. Check the network connection or try again later`);
        return reject(`The operation "${event}" timed out. Check the network connection or try again later`);
      }, timeout);
      return this.socket.emit(event, ...data, (response: SocketResponse) => {
        if (called)
          return;
        called = true;
        clearTimeout(timer);
        if (response.hasError)
          return reject(response.error);
        if (!response.hasData)
          return resolve(response.data);
        return resolve(response.data);
      });
    });
  }

  on(event: string, fun: (...args: any[]) => void) {
    // No promise is needed here, but we're expecting one in the middleware.
    return new Promise<void>((resolve, reject) => {
      if (!this.socket) return reject('No socket connection.');

      this.socket.on(event, fun);
      resolve();
    });
  }

  off(event: string, fun?: (...args: any[]) => void) {
    // No promise is needed here, but we're expecting one in the middleware.
    return new Promise<void>((resolve, reject) => {
      if (!this.socket) return reject('No socket connection.');
      this.socket.off(event, fun);
      resolve();
    });
  }
}