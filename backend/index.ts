import express from 'express';
import {app, server} from './socket/index';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'
import connectDB from './config/connectDB';
import authRouter from './routes/authRoutes';
import searchRouter from './routes/searchRoutes';
import userRouter from './routes/userRoutes';


// import employeeRoutes from './routes/employeeRoutes';
dotenv.config({
  path:'./.env.local'
})

// const app = express()

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// endpoints
app.use('/auth', authRouter)
app.use('/search-user', searchRouter)
app.use('/user', userRouter)

connectDB().then((res:any)=>{
  server.listen(8080, ()=>{
    console.log(`Server is running on http://localhost:8080`);
  })
}  
)