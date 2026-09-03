import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { PORT } from "./config/envConfig.js";
import { connectDatabase } from "./config/dbConfig.js";
import apiRouter from "./routes/index.js"
import { errorHandler } from "./middlewares/error.middleware.js";

const setupAndStartServer = async () => {

    // create the express object
    const app = express();
    
    app.use(cors());
    app.use(clerkMiddleware());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get("/health", (req, res) => {
        res.status(200).json({
            success: true,
            message: "Server is running"
        })
    })

    app.use("/api", apiRouter);

    app.use(errorHandler);

    await connectDatabase();

    app.listen(PORT, () => {
        console.log(`Server started at ${PORT}`);
    })
}

setupAndStartServer();