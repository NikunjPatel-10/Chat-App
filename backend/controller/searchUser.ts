import { UserModel } from "../models/UserModel";

export async function searchUser(request:any, response:any) {
    try {
        const {search} = request.body;

        const query = new RegExp(search,"i")
        const user = await UserModel.find({
            "$or" :[
                {name:query},
                {email: query}
            ]
        }).select("-password")

        return response.json({
            message:'all user',
            data: user,
            success: true
        })


    }
    catch(error:any){
        return response.status(500).json({
            message:error.message || error,
            error:true
        })
    }
}

