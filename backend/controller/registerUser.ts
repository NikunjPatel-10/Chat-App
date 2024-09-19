import { UserModel, } from "../models/UserModel";
import bcrypt from 'bcrypt'

export async function registerUser(request:any, response:any) {
    
    try {
        const {name, email, password, profilePicture} = request.body;
        
        const checkEmail = await UserModel.findOne({ email }) //{ name,email}  // null

        if(checkEmail){
            return response.status(400).json({
                message:'Already user exits',
                error: true
            })
        }

        // Generate a salt and hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);


        const payload = {
            name,
            email,
            profilePicture,
            password : hashedPassword
        }
        const user = new UserModel(payload)

        const userSave = await user.save();

        return response.status(201).json({
            message : "User created successfully",
            data : userSave,
            success : true
        })



    } catch (error:any) {
        return response.status(500).json({
            message: error.message,
            error: true
        })
    }
}