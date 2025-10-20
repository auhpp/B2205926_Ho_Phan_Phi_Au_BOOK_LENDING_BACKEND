import express from "express";
import cors from "cors";
import ApiError from "./app/api-error.js";
import bookRouter from "./app/routes/book.route.js";
import staffRouter from "./app/routes/staff.route.js";
import authRouter from "./app/routes/auth.route.js";

const app = express();
//Settting for cors
const allowedOrigins = [

];
const corsOptions = {
    origin: allowedOrigins
};
app.use(cors(corsOptions));
//middleware for convert body request json to js objec
app.use(express.json());

//Route
app.use("/api/book", bookRouter);
app.use("/api/staff", staffRouter);
app.use("/api/auth", authRouter);


app.get('/', (req, res) => {
    res.json({ message: "Welcome to book lending application" });
});

//handle 404 response
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});


//Handle common error
app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json(
        {
            message: error.message || "Internal Server Error"
        }
    )
});

export default app;