// in this file we need to define all the types and schema for out objects in the database 
import {
  gql
} from "apollo-server-express";

const typeDefs = gql `
type User{
  displayName: String ,
  email:String , 
  photoURL:String , 
  uid:String ,        
},
type Room{
  _id: String ,
  createdAt:String, 
  text:String  , 
  user:MessageUser ,
},
type MessageUser{
  name:String ,
  avatar:String  , 
  _id:String  ,
},
type Query {
  user(uid:String):User,
}
`;

export default typeDefs;