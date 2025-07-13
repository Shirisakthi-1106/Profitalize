import express from "express";
import { PORT } from "./config/env.js";
import cors from 'cors';

import prodRouter from "./routes/products.routes.js";
import profRouter from "./routes/profits.routes.js";
import predictRouter from "../profit_api/profit-predict.js";
import analyticsRouter from "./routes/analytics.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/products", prodRouter);
app.use("/api/v1/profits", profRouter);
app.use("/api/v1/predictions",predictRouter);
app.use("/api/v1/analytics", analyticsRouter);

app.get('/',(req,res)=>{
    res.send('Main app working!');
})

app.listen(PORT, ()=>{
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
})

export default app;