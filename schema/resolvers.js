//in this file we need to define all the resolvers for the types file 
import { gql } from "apollo-server-express"; 


const resolvers = {
    Query: {
      hello: () => 'Hello world!',
    },
  };

export default resolvers;