import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import indexRoutes from './routes/index.routes.js';
import { connectMySql } from './connections/mysql.js'
import connectMongoDB from './connections/mongoose.js';
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/',indexRoutes);

// Check both database connection.
await connectMySql();
await connectMongoDB();

try {
    app.listen(process.env.PORT, () => {
        console.log(`---> server is successfully running on port : ${process.env.PORT} `)
    })
} catch (error) {
    console.log('error while connecting to server --->', error);
}