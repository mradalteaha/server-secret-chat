import express from 'express'
import requireAuth  from  '../middlewares/requireAuth.js'
import {auth ,db} from '../firebase.js'
import { collection, onSnapshot, query, QuerySnapshot, where,addDoc,updateDoc,doc ,getDocs} from 'firebase/firestore';
import { async } from '@firebase/util';


const router = express.Router(); 

//secure router for authorized users only
router.use(requireAuth)

router.get('/rooms',async(req,res)=>{

    try{
    
        const currentUser = auth.currentUser ;

        const chatsQuery = query(// query on firestore collection to get all the current user chats
        collection(db,'rooms'),
        where('participantsArray','array-contains',currentUser.email)
        );

        const docsSnap = await getDocs(chatsQuery);

        const parsedChats = docsSnap.docs.filter((doc)=>doc.data().lastMessage).map(
            (doc)=>({
                ...doc.data(),
                id:doc.id,
                contactedUser:doc.data().participants.find(p=> p.email!== currentUser.email),

            })
        )
            const test = JSON.stringify(parsedChats)
        console.log(test)
        return res.status(200).send({message:'rooms fetched successfully' , chats:JSON.stringify(parsedChats)});
    
  /*
        onSnapshot(chatsQuery,(QuerySnapshot)=>{
             const parsedChats = QuerySnapshot.docs.filter((doc)=>doc.data().lastMessage).map(
                (doc)=>({
                    ...doc.data(),
                    id:doc.id,
                    contactedUser:doc.data().participants.find(p=> p.email!== currentUser.email),
    
                })
            )
            //console.log('printing parsed chat')
            //console.log(parsedChats)
        return res.status(200).send({message:'rooms fetched successfully' , chats:parsedChats});
        });
        
       
*/

    }catch(err){
        console.log('there is error on /rooms')
        return res.status(422).send({message:'error occured on /rooms' , err :err});
    }


    

    
});


router.post('/messageOnSend',async(req,res)=>{ //this route is for the onSend function on chatscreen 

    try{

       
        const roomId = req.body.roomID;
       // console.log('printing room id')
       // console.log(roomId)
        const messages = JSON.parse(req.body.messageob);
       
        const roomRef = doc(db, "rooms", roomId); //document of the room based on it's id
        const roomMessagesRef = collection(db, "rooms", roomId, "messages");//refrecnce for the messegaes on particular room
        const writes  = messages.map(m=>addDoc(roomMessagesRef,m)) //adding the new message to the firestore
        //const lastMessage= messages[messages.length -1]
        const lastMessage= messages
        writes.push(updateDoc(roomRef,{lastMessage:lastMessage}))//updating the last message for the look of chats screen
        await Promise.all(writes)
        return res.status(200).send({resmessage:'message send successfully'})
    }catch(err){
        console.log(err)
       return  res.status(422).send({resmessage:'failed to send on /messageOnSend'})
    }

});

router.post('/getNewMessage',async(req,res)=>{

    try{
        const roomId = req.body.roomID;
        console.log('getNew message triggered ');
        const roomRef = doc(db, "rooms", roomId); //document of the room based on it's id
        const roomMessagesRef = collection(db, "rooms", roomId, "messages");//refrecnce for the messegaes on particular room
        
            const docsSnap = await getDocs(roomMessagesRef);
           const test =  docsSnap.docChanges().filter(({type})=>type ==='added').map(
                ({doc})=>{
                    const message = doc.data()
                    return {...message,createdAt : new Date(message.createdAt)}
                }).sort((a,b)=> b.createdAt.getTime() - a.createdAt.getTime())

            console.log('printing docsnap')
            console.log(test)
            res.status(200).send({message:'last message successfully fetched',messages:test[0]})

      /*  const  unsbsucribe = onSnapshot(roomMessagesRef,querysnapshot=>{
            const messagesFirestore = querysnapshot.docChanges().filter(({type})=>type ==='added').map(
               ({doc})=>{
                   const message = doc.data()
                   return {...message,createdAt : new Date(message.createdAt)}
               }).sort((a,b)=> b.createdAt.getTime() - a.createdAt.getTime())


               console.log('printing added messages to firestore ')

               console.log(messagesFirestore)
               res.status(200).send({message:'last message successfully fetched',messages:messagesFirestore})
             
               
           });*/
    
           
       

    }
    catch(err){
        return res.status(422).send({errmessage:'failed to recieve message update',err:err});
    }

})

router.post('/getMessages',async(req,res)=>{

    try{
        console.log('getMessages called ')
        const roomId = req.body.roomID;

        const roomMessagesRef = collection(db, "rooms", roomId, "messages");//refrecnce for the messegaes on particular room
        const docsSnap = await getDocs(roomMessagesRef);

        const MessagesArray =[];

 

        docsSnap.forEach(doc => {
            const message = doc.data()
            MessagesArray.push({...message,createdAt : new Date(message.createdAt)})
        })

        const finalArray=MessagesArray.sort((a,b)=> b.createdAt.getTime() - a.createdAt.getTime())
        return res.status(200).send({message:'last message successfully fetched',messages:finalArray})
       

    }
    catch(err){
        console.log(err)
        return res.status(422).send({errmessage:'failed to recieve message update',err:err});
    }

})



export default router;