const express = require("express");
let bcrypt = require("bcrypt");

let jwt = require("jsonwebtoken");

const router = express.Router();

const { User } = require("../models/user");

router.get("/", (req, res) => {
  User.find().then(users => {
    res.send(users);
  });
});

router.post('/signup', (req, res) => {
    if(req.body.username && req.body.email && req.body.password){
        User.findOne({email:req.body.email}, (err, email) => {
            if(err){
                res.send('error');
            } else if(email) {
                res.send('email already taken');
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    if(err) return next(err);
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if(err){
                            res.send(err);
                        } else {
                            let username = req.body.username;
                            let email = req.body.email;
                            let newUser = {
                                username:username,
                                email:email,
                                password:hash
                            }

                            let user = new User(newUser);
                            user.save().then((user) => {
                                res.send(user)
                            })
                            .catch((err) => {
                                res.send(err)
                            })
                        }
                    })
                })
            }
        })
    }
})

router.post('/login', (req, res) => {
  if (req.body.email && req.body.password) {
    User.findOne({ email: req.body.email, password: req.body.password },"email username")
      .then(result => {
        let token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            data: result
          },
          "vibhaag"
        );
        res.send({token:token, success:true})
      })
      .catch(err => {
        res.send({err:err, success:false});
      });
  }
});

router.post('/check',(req, res) => {
  jwt.verify(req.headers.auth, 'vibhaag', (err, decoded) => {
    if(err){
      res.send({success:false, message:err})
    }else{
      //save data to db
      //send success:true
    }
  })

})

module.exports = {
  userController: router
};
