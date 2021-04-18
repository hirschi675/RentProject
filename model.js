const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb+srv://hirschi675:greed675@cluster0.vthpy.mongodb.net/items?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

// DATA MODEL

const userSchema = mongoose.Schema( {
  email: {
      type: String,
      required: true,
      unique: true
  },
  username: {
      type: String,
      required: true,
  },
  encryptedPassword: {
      type: String,
      required: true,
  }
})

userSchema.methods.setEncryptedPassword = function (plainPassword, callback) {
  bcrypt.hash(plainPassword, 12).then( (hash) =>  {
      //Store hash in your password DB
      console.log(plainPassword);
      console.log(hash);
      this.encryptedPassword = hash;
      callback();
  });
}

userSchema.methods.verifyPassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.encryptedPassword).then(result => {
      callback(result);
  });
};

userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.encryptedPassword;
  return obj;
};

const User = mongoose.model( 'User:', userSchema);


const categorySchema = mongoose.Schema({
  name: String,
});

const Category = mongoose.model('Category', categorySchema);

const itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category' 
  },
  rented: {
    type: Boolean,
    required: true,
  }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = {
  Item: Item,
  Category: Category,
  User: User
};
