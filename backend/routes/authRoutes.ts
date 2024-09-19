import express from 'express'
import { registerUser } from '../controller/registerUser'
import loginUser from '../controller/loginUser'


const authRouter = express.Router()

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser)

export default authRouter