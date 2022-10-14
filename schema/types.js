// in this file we need to define all the types and schema for out objects in the database 
import { gql } from "apollo-server-express";

const typeDefs = gql`
type Query {
  hello: String
}
`;

export default typeDefs;