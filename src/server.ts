import { createServer } from 'node:http';
import path from "node:path";
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Server } from 'socket.io';
import { globalError } from './middlewares/globalError';
import { serverConfig } from './config';
import { mainRouter } from './routes/main.routes';
import { swaggerSetup } from './utils/swagger';
import notificationsSocketCallBack from './app/notificationsSocketCallBack';



const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
swaggerSetup(app);

app.get('/', (req, res)=> res.send('<h1>Main</h1>'));
app.use('/api', mainRouter);
app.use(express.static(path.join(process.cwd(), "src", 'views')));
app.use(globalError as express.ErrorRequestHandler);

const server = createServer(app);
const io = new Server(server);



const notificationsSocket = io.of('/notifications');

notificationsSocket.on('connection', (socket) => notificationsSocketCallBack(socket, notificationsSocket));

const {PORT} = serverConfig;
server.listen(PORT, () => {console.log(`Server running on port ${PORT}`);
});



















