import express from 'express'
import { registerUser } from '../controller/registerUser'
import loginUser from '../controller/loginUser'
import { getUserById } from '../controller/userDetails'


const userRouter = express.Router()

userRouter.get('/:id', getUserById)

export default userRouter