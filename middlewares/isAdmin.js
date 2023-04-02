import User from "../model/User.js"


const isAdmin = async(req, res, next) => {
    //find the login user
    const user = await User.findById(req.userAuthId)
    //check if admin
    // console.log(user);
    // console.log(user?.isAdmin);
    if(user?.isAdmin){
        next();
    }else{
        next(new Error("access denined, admin only"))
    }
}

export default isAdmin;