import express, { Application, NextFunction, Request, Response } from 'express';
import globalErrorHandler from './middleWare/globalErrorHandler';
import cors from "cors";
import cookieParser from "cookie-parser";
import router from './routes/index';
import notFound from './middleWare/notFound';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//  app.use(cors({ origin: ["https://bikebd-client-nine.vercel.app", "http://localhost:5173"],credentials: true }));
app.use(cors({
  origin: "https://bikebd-client-nine.vercel.app",  
  credentials: true
}));

// application routes
app.use("/api/v1", router);


app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hi Next Level Developer !');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
  });
});

app.use(globalErrorHandler);
// app.use(notFound);

export default app;