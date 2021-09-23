import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import * as sharedsession from 'express-socket.io-session';
import * as session from 'express-session';

export class EventAdapter extends IoAdapter {
  constructor(private app: NestExpressApplication) {
    super(app);
    this.app = app;
  }

  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options);

    const sessionMiddleware = session({
      secret: 'my-secret',
      resave: true,
      saveUninitialized: true,
    });

    this.app.use(sessionMiddleware);

    server.use(sharedsession(sessionMiddleware));
    return server;
  }
}
