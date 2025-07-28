import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { globalError } from './middlewares/globalError';
import { serverConfig } from './config';
import { mainRouter } from './routes/main.routes';


const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


app.get('/', (req, res)=> res.send('<h1>Main</h1>'));
app.use('/api', mainRouter);
app.use(globalError as express.ErrorRequestHandler);

const {PORT} = serverConfig;
app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);
});


/// testing for pull

















