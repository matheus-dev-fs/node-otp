import 'dotenv/config';
import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mainRouter from './routers/main.router.js';

const server: Express = express();
server.use(cors());
server.use(helmet());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use(mainRouter);

const PORT = process.env.PORT ?? 3000;
server.listen(PORT, (): void => {
    console.log(`Servidor rodando na porta ${PORT}`);
});