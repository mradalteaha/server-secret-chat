import express from 'express'
import { collection, onSnapshot, query, QuerySnapshot, where,getDocs,getDoc} from 'firebase/firestore'
import {auth ,db} from '../firebase.js'

const router = express.Router(); 



//this route is responsible for returning the users collection from the database to the clients phone 
router.get('/getUsers', async (req, res) => {

    try{

        //console.log('the route /getUsers')
        const usersRef = collection(db,'users') 
        const docsSnap = await getDocs(usersRef);
        const usersArray =[];
    
        docsSnap.forEach(doc => {
            usersArray.push(doc.data())
        //    console.log(doc.data());
        })

//        console.log('printing the users array : ')
  //      console.log(usersArray)

        return res.status(200).send({message:'all the users extracted successfully' ,users:usersArray})
    }catch(err){
    
        console.log('and error occurd on the /getUsers path')
        console.log(err)
     return  res.status(422).send({message:'error occured extracting users from the database', error:err})
    }

})


export default router ; 