import express from 'express'
import requireAuth  from  '../middlewares/requireAuth.js'

const router = express.Router(); 

//secure router for authorized users only
router.use(requireAuth)

router.get('/rooms',async(req,res)=>{
    res.send(`user  : ${ JSON.stringify(req.user.email) } in rooms route`)
});


export default router;