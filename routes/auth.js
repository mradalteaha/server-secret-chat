import { createUserWithEmailAndPassword, signInWithEmailAndPassword ,signOut} from 'firebase/auth'
import jsonwebtoken from 'jsonwebtoken';
const {sign} = jsonwebtoken;


import express from 'express'
import { auth} from '../firebase.js'
 
const router = express.Router();

router.post('/signUp',async(req,res)=>{
    const {email,password} =req.body;

    try{
        

        await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
           
          const user = userCredential.user;
          
            
            const token =  sign({userId:user.uid},'MY_SECRET_KEY');

         res.send({token});

          
          
        })
        .catch((error) => {
          const errorMessage = error.message;
          return res.status(500).send(errorMessage)
          // ..
        });

        
        
    }catch(err){
        return res.status(500).send(err.message)
    }
});


router.post('/signIn',async(req,res)=>{
    const {email,password} =req.body;
    console.log('sign In')
    
    try{
        await signInWithEmailAndPassword(auth,email,password).then(()=>{
             res.send({message:'sign In successfully'})
        })
       
    }catch(err){
        return res.status(500).send(err.message)
    }
});

router.get('/signIn',async(req,res)=>{
    
    
    try{
        if(!auth.currentUser){
            res.status(422).send({message:'U need to signIn first',user:user})
        }
        else{
            const user = auth.currentUser;
            res.status(200).send({message:'welcome back',user:user})
        }
       
    }catch(err){
        return res.status(500).send(err.message)
    }
});

router.get('/signOut',async(req,res)=>{
    
    
 
        if(!auth.currentUser){
            res.status(422).send({message:'U need to signIn first'})
        }
        else{
            signOut(auth).then(() => {
                res.status(200).send({message:'signout successfully' })
              }).catch((error) => {
                res.status(422).send(error)
              });
        }
       
 
});



export default router;

