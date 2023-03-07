const express = require('express');
const mongodb = require('mongodb');
const router = express();
var multer = require('multer');
var upload = multer();
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const faceCollection=require('./Model/FacebookAuth');
const Collection=require("./Model/User");
const ProfileCollection=require("./Model/Profile");
const SocialLinkConllection=require("./Model/SocialMedia");
const InterestCollection = require("./Model/Interest");
const serverless=require('serverless-http');
// Connect to the MongoDB database

mongoose.set('strictQuery', false);
const client = mongoose.connect("mongodb+srv://asad:asad123@cluster0.qsqlaen.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true });

const FacebookAuth =mongoose.model("FaceBookAuth",faceCollection);
const usersCollection = mongoose.model('User', Collection);

router.use(upload.array());

// FaceLogin Apis
router.post('/Facebooklogin',  async (req, res) => {
    // Verify that the request includes the required information
    
    const UUID=req.body.googleuid;
    const Email =req.body.email;
    const ProfileName=req.body.ProfileName;
    const ProfileImageUrl =req.body.ProfileImageUrl;
     
    //console('sdfsd '+email);
    if (!UUID  || !ProfileImageUrl || !ProfileName) {
      return res.status(400).send({ error: "Information Incomplete" });
    }
  
    // Check if the user exists
    const existingUser = await FacebookAuth.findOne({ UUID });
    if (existingUser) {
      // User exists, log them in
      return res.status(200).send(existingUser);
    } else {
      // User does not exist, sign them up
      const newUser = { UUID, Email ,ProfileName,ProfileImageUrl};
      await FacebookAuth.create(newUser);
      return res.status(200).send(newUser);
    }
  });

  //Google Login APis
router.post('/Googlelogin',  async (req, res) => {
  // Verify that the request includes the required information
  
  const UUID=req.body.googleuid;
  const Email =req.body.email;
  const ProfileName=req.body.ProfileName;
  const ProfileImageUrl =req.body.ProfileImageUrl;
   
  //console('sdfsd '+email);
  if (!UUID || !Email || !ProfileImageUrl || !ProfileName) {
    return res.status(400).send({ error: "Information Incomplete" });
  }

  // Check if the user exists
  const existingUser = await usersCollection.findOne({ UUID });
  const User = { 
    email: Email 
  };
  
  const token = jwt.sign(User, 'your_secret_key_here', { expiresIn: '1h' });
  
  if (existingUser) {
    // User exists, log them in
    existingUser.token=token;
    return res.status(200).send(existingUser);
  } else {
    // User does not exist, sign them up
    const newUser = { UUID, Email ,ProfileName,ProfileImageUrl};
    await usersCollection.create(newUser);
    newUser.token=token;
    return res.status(200).send(newUser);
  }
});

router.get('/',async(req, res)=>{
    res.send("sdfsd");
})

//Add Profile
router.post('/AddProfile',  async (req, res) => {
  // Verify that the request includes the required information
  
  const name=req.body.name;
  const email=req.body.email;
  const language=req.body.language;
  const age=req.body.age;
  const location=req.body.location;
  const locationLat=req.body.locationLat;
  const locationLng=req.body.locationLng;
  const interestId=req.body.interestId;
  const gender=req.body.gender;
  const profile=req.body.Profile;
  const Country=req.body.Country;
  const points=req.body.points;
  const educationLevel=req.body.educationLevel;
  
 // const { name, email, language, age, location, locationLat, locationLng, interestId, gender, educationLevel } = req.body;
   
  
  if (!email) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  // Check if the user exists
  const existingUser = await ProfileCollection.findOne({ email });
  if (existingUser) {
    // User exists, log them in
    return res.status(200).send(existingUser);
  } else {
    // User does not exist, sign them up
    const newUser = { name,
      email,
      language,
      age,
      location,
      locationLat,
      locationLng,
      interestId,
      gender,
      educationLevel,
      profile,
      points,
      Country
    };
    await ProfileCollection.create(newUser);
    return res.status(200).send(newUser);
  }
});

//Edit Profile
router.post('/EditProfile',  async (req, res) => {
  // Verify that the request includes the required information
  try{
    const name=req.body.name;
    const email=req.body.email;
    const language=req.body.language;
    const age=req.body.age;
    const location=req.body.location;
    const locationLat=req.body.locationLat;
    const locationLng=req.body.locationLng;
    const interestId=req.body.interestId;
    const gender=req.body.gender;
    const Country=req.body.Country;
  const points=req.body.points;
    const educationLevel=req.body.educationLevel;
   // const { name, email, language, age, location, locationLat, locationLng, interestId, gender, educationLevel } = req.body;
     
    console.log('sdfsd '+email);
    if (!email) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    // Check if the user exists
    const user = await ProfileCollection.findOne({ email });
    if (user) {
      // User exists, log them in
      user.name = name;
      user.language = language;
      user.age = age;
      user.location = location;
      user.locationLat = locationLat;
      user.locationLng = locationLng;
      user.interestId = interestId;
      user.gender = gender;
      user.educationLevel = educationLevel;
      user.Country=Country;
      user.points=points;
      const updatedUser = await user.save();
  
      return res.send(user);
      
    } else {
      // User does not exist, sign them up
      
      return res.send("User does'nt exsits");
    }
  }
  catch(error){
    throw error;
  }

});

//Add User Link
router.post('/SocialLink', async (req, res) => {
  const email=req.body.email;
  const facebookLink=req.body.facebookLink;
  const instagramLink=req.body.instagramLink;
  const tiktokLink=req.body.tiktokLink;
  const whatsappLink=req.body.whatsappLink;
  
  try {
    // check if social media links already exist for given email
    let socialMedia = await SocialLinkConllection.findOne({ email });

    if (socialMedia) {
      // if social media links already exist, update them
      return res.status(200).send(socialMedia);
    } else {
      // if social media links do not exist, create new document
      socialMedia = new SocialLinkConllection({ email, facebookLink, instagramLink, tiktokLink, whatsappLink });
    }

    // save changes to database
    await socialMedia.save();

    res.status(200).send(socialMedia);
  } catch (err) {
    console.error(err);
    res.status(500).send(socialMedia);
  }
});

router.post('/EditSocialLink', async (req, res) => {
  const email=req.body.email;
  const facebookLink=req.body.facebookLink;
  const instagramLink=req.body.instagramLink;
  const tiktokLink=req.body.tiktokLink;
  const whatsappLink=req.body.whatsappLink;
  
  try {
    // check if social media links already exist for given email
    let socialMedia = await SocialLinkConllection.findOne({ email });

    if (socialMedia) {
      // if social media links already exist, update them
      socialMedia.facebookLink = facebookLink;
      socialMedia.instagramLink = instagramLink;
      socialMedia.tiktokLink = tiktokLink;
      socialMedia.whatsappLink = whatsappLink;
    } else {
      // if social media links do not exist, create new document
      return res.status(400).send("No Record found");
    }

    // save changes to database
    await socialMedia.save();

    res.status(200).send(socialMedia);
  } catch (err) {
    console.error(err);
    res.status(500).send(socialMedia);
  }
});

router.get('/getInterestsList', async (req, res) => {
  try {
    const interests = await InterestCollection.find();
    res.status(200).json(interests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/Searchusers', async (req, res) => {
  try {
    // Get search filters from query parameters
    const searchedText = req.body.searchedText;
    const minAge = req.body.minAge;
    const maxAge = req.body.maxAge;
    const gender = req.body.gender;
    const interests = req.body.interests ;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const radius = req.body.radius;

    // Build Mongoose query
    const query = ProfileCollection.find({name:searchedText});

    
    // if (searchedText) {
    //   // Search for users that match searchedText in name or bio
    //   query.or([{ name: { $regex: searchedText, $options: 'i' } }, { bio: { $regex: searchedText, $options: 'i' } }]);
    // }

    if (minAge) {
      // Search for users that are at least minAge years old
      query.where('age').gte(minAge);
    }

    if (maxAge) {
      // Search for users that are at most maxAge years old
      query.where('age').lte(maxAge);
    }

    if (gender) {
      // Search for users that match the gender filter
      query.where('gender').equals(gender);
    }

    // if (interests.length > 0) {
    //   // Search for users that have at least one of the specified interests
    //   query.where('interestId').in(interests);
    // }

    // if (latitude && longitude && radius) {
    //   // Search for users that are within radius miles of the specified location
    //   const distance = radius / 3963.2; // Convert radius from miles to radians
    //   query.where('location').near({
    //     center: {
    //       type: 'Point',
    //       coordinates: [longitude, latitude],
    //     },
    //     maxDistance: distance,
    //   });
    // }
//    const results = performUserSearch(searchedText, minAge, maxAge, gender, interests, latitude, longitude, radius);
    // Execute the query and return the results
    // const Email="asadhayat2007@gmail.com";
    // const existingUser =await usersCollection.findOne({ Email });
    // if(existingUser){
    //   console.log(existingUser);
    // }
    
    const users = await query.lean().exec();
    users.forEach(async (user) => {
      console.log(`User ${user.email} updated successfully`);
      const email=user.email;
      const existingUsergmail = await usersCollection.findOne({ Email:email});
      if(existingUsergmail){
        user.ProfileImageUrl=existingUsergmail.ProfileImageUrl;
        user.ProfileName=existingUsergmail.ProfileName;
        // newuser = [...user, ...existingUser];
        // console.log(newuser);
      }

      const existingUserfacebook = await FacebookAuth.findOne({ Email:email});
      if(existingUserfacebook){
        user.ProfileImageUrl=existingUserfacebook.ProfileImageUrl;
        user.ProfileName=existingUserfacebook.ProfileName;
        // newuser = [...user, ...existingUser];
        // console.log(newuser);
      }

      const SocialLinks = await SocialLinkConllection.findOne({ email:email});
      if(SocialLinks){
        user.facebookLink=SocialLinks.facebookLink;
        user.instagramLink=SocialLinks.instagramLink;
        user.tiktokLink=SocialLinks.tiktokLink;
        user.whatsappLink=SocialLinks.whatsappLink;
        // newuser = [...user, ...existingUser];
        // console.log(newuser);
      }
      //lo
      // user.city = "khanuse";
      // user.updateOne((err) => {
      //   if (err) {
      //     console.error(err);
      //     return;
      //   }
      //   console.log(`User ${user.city} updated successfully`);
        
      // });
      try{
        console.log(users);  
        res.status(200).json(users);
      }
      catch(e){
        console.log(e.message);
      }
     
    });
   } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
module.exports.handler=serverless(router);