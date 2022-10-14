import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
const app = express();
import authRoutes from './routes/auth.js'
import getRooms from './routes/getRooms.js'
import requireAuth  from  './middlewares/requireAuth.js'
import ProfileHandler from './routes/ProfileHandler.js'
import getUsers from './routes/getUsers.js'
import {graphqlHTTP} from 'express-graphql'
import schema from './schema/schema.js';
import {ApolloServer,gql} from 'apollo-server-express'

const PORT = process.env.PORT || 4000 ; 

dotenv.config();

app.use(cors({origin: true, credentials: false}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

  const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

app.use(authRoutes); // sign in / sign up routes
app.use(getRooms); // chat rooms routes
app.use(getUsers);
app.get('/',requireAuth,(req,res)=>{

    res.send(`your email : ${ JSON.stringify(req.user) }`)
})
app.use(ProfileHandler);
app.get('/',(req,res)=>{

    res.send(`your email : ${ JSON.stringify(req.user) }`)
})


app.use('/graphql',graphqlHTTP({
    graphiql:true,
    schema,
    
}));

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();
server.applyMiddleware({ app });

app.listen(PORT, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
﻿


