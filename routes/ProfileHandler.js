import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import express from 'express'
import { auth,db} from '../firebase.js'
 
const router = express.Router();




router.post('/ProfilePhotoUpload',async (req,res)=>{

    const photo = req.body.photo;
    const user=auth.currentUser;

    try{
        const {url}= await uploadImage(photo ,`Images/${user.uid}`,"profilePicture" )
        res.status(200).send({photoURL:url , message:'photo uploaded successfully'})
    }
    catch(err){

        res.status(400).send({message:'something went wrong uploading the image ', error:err})

    }


})

router.post('/ProfileUpdate',async (req,res)=>{

    const user=auth.currentUser;
    const {userData}=req.body

    try{

        await Promise.all([updateProfile(user,userData),setDoc(doc(db,'users',user.uid),{...userData,uid:user.uid})])
        res.status(200).send({ message:'profile updated successfully'})
    }
    catch(err){

        res.status(400).send({message:'something went wrong updating the profile ', error:err})

    }


})



export default router;