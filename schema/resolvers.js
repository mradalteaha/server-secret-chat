//in this file we need to define all the resolvers for the types file 
import { gql } from "apollo-server-express"; 

const User={
  displayName: 'display name '  ,
  email:'email' , 
  photoURL: 'photo url',
  uid:'uid', 
}

const resolvers = {
    Query: {
      hello: () => 'Hello world!',
      user:(uid)=>User,
    },
  };

export default resolvers;