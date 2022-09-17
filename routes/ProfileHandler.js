import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { nanoid } from 'nanoid'
import express from 'express'
import { auth, db, storage } from '../firebase.js'
import multer from 'multer';




const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb('invalid image file!', false);
    }
};

const mulstorage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    }
});

var upload = multer({ storage: mulstorage, fileFilter });

const router = express.Router();




router.post('/ProfilePhotoUpload', upload.single('file'), async (req, res) => {
    //this path response to upload profile photo uppon registeration 
    const photo = req.file; //the file is byteStream returned from multer 
    const user = auth.currentUser;


    try {
        if (user && photo) {
            let fName = "profilePicture"
            let path = `Images/${user.uid}`
            const fileName = fName || nanoid();
            const imageRef = ref(storage, `${path}/${fileName}.jpeg`);
            try {

                const result = await uploadBytesResumable(imageRef, photo.buffer);
                const url = await getDownloadURL(result.ref);
                if(url){
                    console.log('everything alright')
                    return res.status(200).send({ message: 'uploaded successfully ', url: url })
                }

            } catch (err) {
                console.log('error uploading the photo')
                console.log(err)
                return res.status(422).send({ message: 'something went wrong uploading the image ', error: err })
            }




        }


    }
    catch (err) {
        console.log('error on /profilephotoupload')
        console.log(err)
        return res.status(400).send({ message: 'something went wrong on path /ProfilePhotoUpload ', error: err })

    }


})





router.post('/ProfileUpdate', async (req, res) => {

    const user = auth.currentUser;
    const { userData } = req.body
    console.log(req.body)

    console.log('ProfileUpdate triggered')
    console.log('userData')
    console.log(userData)



    try {
        if (user && userData) {


            //await Promise.all([updateProfile(user,userData),setDoc(doc(db,'users',user.uid),{...userData,uid:user.uid})])
            res.status(200).send({ message: 'profile updated successfully' })
        } else {
            res.status(400).send({ message: 'empty user Data ', error: err })

        }

    }
    catch (err) {

        res.status(400).send({ message: 'something went wrong updating the profile ', error: err })

    }


})



export default router;