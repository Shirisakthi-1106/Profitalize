import express from "express";
import { PORT } from "./config/env.js";

import prodRouter from "./routes/products.routes.js";
import profRouter from "./routes/profits.routes.js";

const app = express();

app.use(express.json());

app.use("/api/v1/products", prodRouter);
app.use("/api/v1/profits", profRouter);

app.get('/',(req,res)=>{
    res.send('Main app working!');
})

app.listen(PORT, ()=>{
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
})

export default app;