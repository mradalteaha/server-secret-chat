import * as graphql from 'graphql'
import _ from 'lodash'
import {db} from '../firebase.js'
import { collection, onSnapshot, query, QuerySnapshot, where,addDoc,updateDoc,doc ,getDocs, getDoc} from 'firebase/firestore';


const {
GraphQLObjectType,
GraphQLString,
GraphQLSchema,
GraphQLList,
GraphQLNonNull
} = graphql



//this object instruct graphql how the user object looks like
const UserType = new GraphQLObjectType({
    name : 'User', //name of this object
    fields:()=>({ //fields of this object
        displayName: {type: GraphQLString } ,
        email:{type: GraphQLString } , 
        photoURL:{type:GraphQLString } , 
        uid:{type:GraphQLString } ,
        rooms:{
            type: new GraphQLList(RoomType),
            async resolve(parentValue){
                const roomRef = collection(db,`rooms`)
                const docsSnap = await getDocs(roomRef)

                const roomArray = docsSnap.docs.map(doc => ({roomID: doc.id,...doc.data()})) //get all the relevant data as array
                const UserRooms = roomArray.filter(elem => elem.participantsArray.includes(parentValue.email))
                //console.log(UserRooms)
                return UserRooms

            }
        }
    }) 
});

const MessageUserType = new GraphQLObjectType({
    name : 'MessageUserType', //name of this object
    fields:()=>({ //fields of this object
        name: {type: GraphQLString } ,
        avatar:{type:GraphQLString } , 
        _id:{type:GraphQLString } ,
    }) 
});


const MessageType = new GraphQLObjectType({
    name : 'Message', //name of this object
    fields:()=>({ //fields of this object
        _id: {type: GraphQLString } ,
        createdAt:{type: GraphQLString } , 
        text:{type:GraphQLString } , 
        user:{type:MessageUserType} ,
    })   
});


const RoomType = new GraphQLObjectType({
    name : 'Room', //name of this object
    fields:()=>({ //fields of this object

        lastmessage:{type:new GraphQLList(GraphQLString)} , 
        participants:{type: new GraphQLList (UserType) } , 
        participantsArray:{type:new GraphQLList(GraphQLString)} ,
        roomID:{type:GraphQLString } ,
        messages: {type: new GraphQLList (MessageType) ,
           async resolve(parentValue){
            console.log(parentValue.roomID)
                const messegesRef = collection(db,`rooms/${parentValue.roomID}/messages`)
                const messegesDocs = await getDocs(messegesRef)
                console.log('messeage resolver has been called on room type')
                const messages = messegesDocs.docs.map(doc => ({messageId: doc.id,...doc.data()})).sort((a,b)=> new Date(a.createdAt) - new Date(b.createdAt)) //get all the relevant data as array
                return messages
            }
        } ,

        users:{
            type: new GraphQLList (UserType),
            resolve(parentValue){
                console.log('inside room type user resolver')
                console.log(parentValue)
                return parentValue.participants
            }
        }

    })   
});





const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        user:{
            type:UserType,
            args:{uid:{type:GraphQLString}},
            async resolve(parentValue,args){//where we get into the database
                const usersRef = collection(db,'users') 
                const docsSnap = await getDocs(usersRef);
                const usersArray = docsSnap.docs.map(doc => doc.data()) //get all the relevant data as array
                //console.log(usersArray)
            return _.find(usersArray,{uid:args.uid})
            }
        }
        ,
        room:{
            type:RoomType,
            args:{roomID:{type:GraphQLString}},
            async resolve(parentValue,args){//where we get into the database
                const roomRef = collection(db,`rooms`)
                const docsSnap = await getDocs(roomRef)
                const roomArray = docsSnap.docs.map(doc => ({roomID: doc.id,...doc.data()})) //get all the relevant data as array
            return _.find(roomArray,{roomID:args.roomID})
            }
        }

    }
});

/*
const mutation = new GraphQLObjectType({ // the field in the mutations describe the action of the mutation 
    name:'Mutation',
    fields:{
        
        sendMessage:{
            type: GraphQLString, 
            args: {
                text :new GraphQLNonNull(GraphQLString) ,


            },
            resolve(){
                return text
            }
        }
    }
})

*/
const schema = new GraphQLSchema({
    query:RootQuery,
   

});
export default schema