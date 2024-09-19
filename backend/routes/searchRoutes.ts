import express from 'express';
import {searchUser} from './../controller/searchUser'


const searchRouter = express.Router();

searchRouter.post('/', searchUser);

export default searchRouter
