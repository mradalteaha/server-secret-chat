import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
const app = express();
import authRoutes from './routes/auth.js'
import getRooms from './routes/getRooms.js'
import requireAuth  from  './middlewares/requireAuth.js'
import ProfileHandler from './routes/ProfileHandler.js'
const PORT = process.env.PORT || 5000 ; 


dotenv.config();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(authRoutes); // sign in / sign up routes
app.use(getRooms); // chat rooms routes
/*
app.get('/',requireAuth,(req,res)=>{

    res.send(`your email : ${ JSON.stringify(req.user) }`)
})
*/

app.use(ProfileHandler);
app.get('/',(req,res)=>{

    res.send(`your email : ${ JSON.stringify(req.user) }`)
})
app.get('/test',requireAuth,(req,res)=>{

    res.send(`test page`)
})


app.listen(PORT ,()=>{
    console.log('server running on port' + `${PORT}`)
})
