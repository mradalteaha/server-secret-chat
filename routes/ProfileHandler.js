import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { nanoid } from 'nanoid'
import express from 'express'
import { auth, db, storage } from '../firebase.js'
import multer from 'multer';
import { XMLHttpRequest } from 'xmlhttprequest'




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



//this route used before for test and it shows progress 
/*
router.post('/ProfilePhotoUpload', upload.single('file'), async (req, res) => {
    //this path response to upload profile photo uppon registeration 
    const photo = req.file; //the file is byteStream returned from multer 
    const user = auth.currentUser;

/*
    console.log('printing req.file')
    console.log(photo)
    console.log('printing req.body')
    console.log(req.body)
    const {displayName,email}=req.body
    //console.log(`user display Name = ${displayName} and email user email = ${email}`)
    const userData={
        displayName:displayName,
        email:email

    }

//    console.log('printing user data')
  //  console.log(userData);


    console.log('upload triggered on server')
    try {
        if (user && photo) {
            console.log(photo)
            let fName = "profilePicture"
            let path = `Images/${user.uid}`
            const fileName = fName || nanoid();
            const imageRef = ref(storage, `${path}/${fileName}.jpeg`);  
            const metadata = {
                contentType: 'image/jpeg'
              };
            try {


          


                const uploadTask =  uploadBytesResumable(imageRef, photo.buffer,metadata);

                uploadTask.on('state_changed',
                    (snapshot) => {

                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        return res.status(400).send({ message: 'upload failed try again  ', error })
                    },
                    () => {

                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            userData.photoURL = downloadURL
                            console.log('user Data after uploading ')
                            console.log(userData)

                           
                           // return res.status(200).send({ message: 'uploaded successfully ', url: downloadURL })

                        });
                    }
                )

                const finish = await Promise.all([updateProfile(user,userData),setDoc(doc(db,'users',user.uid),{...userData,uid:user.uid})])
                if(finish){
                    console.log('finish')
                    console.log(finish)
                    return res.status(200).send({ message: ' Prifile set up successfully  ' })
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
*/


router.post('/ProfilePhotoUpload', upload.single('file'), async (req, res) => {
    //this path response to upload profile photo uppon registeration 
    const photo = req.file; //the file is byteStream returned from multer 
    const user = auth.currentUser;

    /*
        console.log('printing req.file')
        console.log(photo)
        console.log('printing req.body')
        console.log(req.body)*/
    const { displayName, email } = req.body
    //console.log(`user display Name = ${displayName} and email user email = ${email}`)
    const userData = {
        displayName: displayName,
        email: email

    }

    //    console.log('printing user data')
    //  console.log(userData);


    console.log('upload triggered on server')
    try {
        if (user && photo) {
            console.log(photo)
            let fName = "profilePicture"
            let path = `Images/${user.uid}`
            const fileName = fName || nanoid();
            const imageRef = ref(storage, `${path}/${fileName}.jpeg`);
            const metadata = {
                contentType: 'image/jpeg'
            };
            try {

                var progress = 0;
                const uploadTask =  uploadBytesResumable(imageRef, photo.buffer,metadata);

                 uploadTask.on('state_changed',
                    (snapshot) => {

                         progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        return res.status(400).send({ message: 'upload failed try again  ', error })
                    }
                )
                const snapshot = await uploadTask

                const downloadURL = await getDownloadURL(imageRef);

                userData.photoURL = downloadURL


                await Promise.all([updateProfile(user, userData), setDoc(doc(db, 'users', user.uid), { ...userData, uid: user.uid })])
                    
                console.log('user data')
                console.log(userData)

                return res.status(200).send({ message: ' Profile Set Up finished successfully ' })


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









export default router;