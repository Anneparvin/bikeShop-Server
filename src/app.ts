import express, { Application, NextFunction, Request, Response } from 'express';
import globalErrorHandler from './middleWare/globalErrorHandler';
import cors from "cors";
import cookieParser from "cookie-parser";
import router from './routes/index';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// application routes
app.use("/api/v1", router);


app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hi Next Level Developer !');
});

//Not Found
// app.use(notFound);
app.use(globalErrorHandler);


export default app;