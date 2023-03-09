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
import typeDefs from './schema/types.js';
import resolvers from './schema/resolvers.js';
import {generateKeyPairSync} from 'crypto'
const PORT = process.env.PORT || 4000 ; 




dotenv.config();

app.use(cors({origin: true, credentials: false}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));



// Provide resolver functions for your schema fields



/* app.use(authRoutes); // sign in / sign up routes
app.use(getRooms); // chat rooms routes
app.use(getUsers);

 */
app.get('/',(req,res)=>{

    res.send(`hello`)
})


app.get('/GenerateKeys',(req,res)=>{

try{

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
	modulusLength: 2048,
	publicKeyEncoding: {
	  type: "pkcs1",
	  format: "pem",
	},
	privateKeyEncoding: {
	  type: "pkcs1",
	  format: "pem",
	},
  });

  res.send(`your keys are public key : ${publicKey} \n private key : ${privateKey} `)

}catch(err){

}

})





//app.use(ProfileHandler);

/*
app.use('/graphql',graphqlHTTP({
    graphiql:true,
    schema,
    
}));*/

/* const server = new ApolloServer({ typeDefs, resolvers });
await server.start();
server.applyMiddleware({ app });
 */
app.listen(PORT, () =>
  console.log(`🚀 Server ready at http://localhost:4000`)
);
﻿


