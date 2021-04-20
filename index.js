const express = require('express');
const stripe = require('stripe')('sk_test_51IddguFQxaJB0xPOTqhmXuxtTRe6Z8UTtP5oB4Kpxsz5MgyUKtbswA91h6c5asmZ0s963i1QYrcslkau2va6d4AK00byR9c5O3');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const model = require('./model');
const passport = require('passport');
const passportLocal = require('passport-local');
const ejs = require('ejs');


const multer = require('multer');
// const upload = multer({dest: __dirname + '/uploads/images'});

const app = express()
const port = 8080;

// Set Storage Engine

const storage = multer.diskStorage({
  destination: './public/uploads/', 
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-'  + Date.now() + 
    path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
}).single('myImage');

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

var loggedIn = false;

// Handlebars Middleware
// app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine', 'ejs');

// Body Parser Middleware
app.use(express.static('./public'));

// Set Static Folder
app.use(express.static(`${__dirname}/public`));


app.use(express.urlencoded({extended: false}));
// NULL USED TO OPEN IN CHROME FROM LOCAL FIEL IF NOT USE YOUR CLIENT ORIGIN
app.use(cors({ credentials: true, origin: 'null'}));
// app.use(cors());
app.use(express.static('public'));
// THIS SHOULD BE THE CLIENT ORIGIN FOR EXAMPLE
// app.use(cors({ credentials: true, origin: 'https://djholt.github.io'}));
app.use(session({ secret: 'asdfakl;wk;lfawjfwfwa', resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

const Item = model.Item;
const Category = model.Category;
const User = model.User;

// 1. local strategy implementation
passport.use(new passportLocal.Strategy({
  usernameField: "email",
  passwordField: "plainPassword"
// some configs go here
}, function (email, plainPassword, done) {
  User.findOne({email: email}).then(function (user) {
      if (!user) {
          return done(null, false);
      }
      //Verify user's password
      user.verifyPassword(plainPassword, function (result) {
          if (result) {
              console.log("User Verified");
              done(null, user);
          } 
          else {
              console.log("User Not Verified");
              done(null, false);
          }
      });
  }).catch(function (err) {
      done(err);
  });
}));

// 2. serialize user to session
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

// 3. deserialize user from sessions
passport.deserializeUser(function(userId, done) {
  User.findOne({ _id: userId}).then(function (user) {
      done(null, user);
  }).catch (function (err) {
      done(err);
  });
});

//  4. authenticate endpoint
app.post("/session", passport.authenticate("local"), function (req, res) {
  res.sendStatus(201);
  loggedIn = true;
});

// 5. "me" endpoint
app.get("/session", function (req, res) {
  // console.log("Do I have a User", req.user);
  if (req.user) {
      // Send user details
      res.json(req.user);
  }
  else {
      res.sendStatus(401);
      //send 401
  }
});

app.delete('/session', function(req, res){
  console.log("LOGGING OUT", req.user);
  req.logOut();
  loggedIn = false;
  res.sendStatus(200);
});

// list all categories
app.get('/items/categories', (req, res) => {
  console.log("GETTING CATEFORIES");
  console.log("Does nodemon work");
    model.Item.find().populate('category').then((categories) => {
    console.log("categories queried from DB:", catgories);
    res.json(categories);
  });
});

// create new category
app.post('/items/categories', (req, res) => {
  // create a new category record, append to items collection
  var category = new model.Category({
    name: req.body.name,
  });
  category.save().then((category) => {
    console.log('category created!');
    res.status(201).json(category);
  }).catch(function (err) {
    if (err.errors) {
      // mongoose validation faliure!
      var messages = {};
      for (var e in err.errors) {
        messages[e] = err.errors[e].message;
      }
      res.status(422).json(messages);
    } else {
      // some other (probably worse) failure.
      res.sendStatus(500);
    }
  });
});

// create new category
app.post('/items/items', (req, res) => {
  console.log(req.body.user, "LOOK AT THIS");
  // var myUser = req.body.user._id
  upload(req, res, (err) =>  {
    if(err) {
      console.log("error");
    }
    else {
      if(req.file == undefined){
        console.log("No file was found")
      } else {
        console.log("File Found")
      }
    }
    console.log("THIS IS THE ITEM THAT IS BEING ADDED", req.body)
    var item = new model.Item({
      name: req.body.myName,
      price: req.body.myPrice,
      // owner: myUser,
      // owner: "606fba20e15eeb54f627fdf6",
      owner: req.body.myUser,
      description: req.body.myDescription,
      image: req.file.filename,
      category: req.body.myCategory,
      rented: false,
    });
    item.save().then(() => {
      console.log('category created!');
      // res.status(201)
      res.redirect("../create.html")
    }).catch(function (err) {
      if (err.errors) {
        // mongoose validation faliure!
        var messages = {};
        for (var e in err.errors) {
          messages[e] = err.errors[e].message;
        }
        res.status(422).json(messages);
      } else {
        // some other (probably worse) failure.
        res.sendStatus(500);
      }
    });
  })
  // create a new category record, append to items collection
});


app.put("/items/items/:itemId", (request, response) => {
  console.log("Update Request here", request.params.itemId);
  Item.findOne({ _id: request.params.itemId}).then((item) => {
      // response.setHeader("Access-Control-Allow-Origin", "*");
      if(item) {
          item.name = request.body.name;
          item.price = request.body.price;
          item.owner = request.body.owner;
          item.description = request.body.description;
          item.image = request.body.image;
          item.category = request.body.category;
          item.rented = request.body.rented;
          item.save().then(() => {
              console.log('Item Updated!');
              response.setHeader("Access-Control-Allow-Origin", "*");
              response.sendStatus(200);
          }).catch((err) =>  {
              response.sendStatus(500);
          });
      }
      else {
          response.sendStatus(404);
      }
  }).catch((err) => {
      response.sendStatus(400);
  });
});


app.get('/', (req, res) => {
  res.render('index');
})




app.post('/charge', (req, res) => {
  console.log("THIS SHOULD PRINT");
  const amount = 5000;
  console.log(req.body);
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  }).then(customer => stripe.charges.create({
      amount:amount
  }))
});


app.get("/items/categories/:categoryId/items", (request, response) => {
  Item.find({category: request.params.categoryId}).then((items) => {
      response.setHeader("Access-Control-Allow-Origin", "*");
      if(items) {
          response.json(items);
      }
      else {
          response.sendStatus(404);
      }
  }).catch((err) => {
      response.sendStatus(400);
  });
});





// retrieve existing item member
app.get('/items/items/:itemId', (req, res) => {
  Item.findOne({ _id: req.params.itemId }).then((item) => {
    if (item) {
      res.json(item);
    } else {
      res.sendStatus(404);
    }
  }).catch((err) => {
    res.sendStatus(400);
  })
})

app.delete("/items/items/:itemId" , (request, response) => {
  Item.findOne({ _id: request.params.itemId}).then((list) => { 
      if(list){
          list.delete().then(() => {
              response.setHeader("Access-Control-Allow-Origin", "*");
              response.sendStatus(200);
          }).catch((err) =>  {
              response.sendStatus(500);
          });
      }
      else {
          response.sendStatus(404);
      }
  }).catch((err) => {
      response.sendStatus(400);
  });
});





app.post('/items/users', (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  var user = new model.User({
      email: req.body.email,  
      username: req.body.username,  
  });
  user.setEncryptedPassword(req.body.password, function () { 
      user.save().then( (user) => {
          console.log("User Created!", user);
          res.sendStatus(201);
      }).catch(function (err) {
          if(err.errors) {
              var messages = {};
              for (var e in err.errors) {
                  messages[e] = err.errors[e].message;
              }
              res.status(422).json(messages);
          }
          else if (err.code == 11000) {
              // email: "Already registered."
              res.status(409);
          }
          else {
              res.status(500);
          }
      });
  }); 

});




// STRIPE TEST
const strypePublicKey = "pk_test_51IddguFQxaJB0xPODKcjJcpaHzL6pO89wRw5DRD9Bg7IcTQgVPeWw6YljboUSv7kvUPySx5mYt713zWVsy6JZmWw00XXoeEUlW";
// THIS SHOULD BE HIDDEN
const strypeSecretKey = "sk_test_51IddguFQxaJB0xPOTqhmXuxtTRe6Z8UTtP5oB4Kpxsz5MgyUKtbswA91h6c5asmZ0s963i1QYrcslkau2va6d4AK00byR9c5O3";

app.get('/store', function(req, res) {
  console.log("accessing the store");
});

app.post('/purchase', function(req, res) {
  console.log(req.body.price, "Price");
  const charge = stripe. charges.create({
    amount: req.body.price,
    source: req.body.stripeTokenId,
    currency: 'usd'
  }).then(function() {
    console.log('Charge Successful')
    res.json({ message: 'Successfully purchased items' })
  }).catch(function() {
    console.log('Charge Fail')
    res.status(500).end()
  })
  console.log("This is the charge", charge);
})

app.post('/api/checkout', (req, res) => { 
  res.sendStatus(200);
});


app.listen(port, () => {
  console.log("listening on port", port);
})
