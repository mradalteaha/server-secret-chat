import {auth} from '../firebase.js'


function authCheck(req,res,next){

    if(!auth.currentUser){
        return res.status(401).send({error:'you must be logged in'})

    }
    req.user=auth.currentUser;
    next();


}

export default authCheck;