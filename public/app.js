// var stripe = Stripe('pk_test_51IddguFQxaJB0xPODKcjJcpaHzL6pO89wRw5DRD9Bg7IcTQgVPeWw6YljboUSv7kvUPySx5mYt713zWVsy6JZmWw00XXoeEUlW');

// var stripeHandler = stripe.StripeCheckout.configure({
//   key: srtipePublicKey,
//   locale: 'auto',
//   token: function(token) {

//   }
// })


// create a new item on server
function createItemOnServer(item) {
  var itemData = "name=" + encodeURIComponent(item.name);
  itemData += "&price=" + encodeURIComponent(item.price);
  itemData += "&owner=" + encodeURIComponent(item.owner);
  itemData += "&description=" + encodeURIComponent(item.description);
  itemData += "&image=" + encodeURIComponent(item.description);
  itemData += "&category=" + encodeURIComponent(item.category);
  itemData += "&rented=" + encodeURIComponent(false);
  console.log(item, " THIS IS THE NEW ITEM I DON'T THINK IT'S WORKING" )
  return fetch("http://localhost:8080/items/items", {
    method: "POST",
    body: itemData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
 }

function authenticateUser(email, password) {
  // console.log(email, password, "THIS IS THE EMAIL AND PASSWORD");
  let data = "email=" + encodeURIComponent(email);
  data += "&plainPassword=" + encodeURIComponent(password);
  return fetch("http://localhost:8080/session", {
    credentials: "include",
    body: data,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}


  function createCategoryOnServer(category) {
    var categoryData = "name=" + encodeURIComponent(category.name);
    return fetch("http://localhost:8080/items/categories", {
      method: "POST",
      body: categoryData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
  }

  function createUserOnServer(user) {
    var userData = "email=" + encodeURIComponent(user.email);
    userData += "&username=" + encodeURIComponent(user.user);
    userData += "&password=" + encodeURIComponent(user.plainPassword);
    return fetch("http://localhost:8080/items/users", {
      method: "POST",
      body: userData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
  }

  function getItemsFromServer(category) {
    return fetch("http://localhost:8080/items/categories/" + category + "/items");
  }

  function getSession() {
    return fetch("http://localhost:8080/session", {
      credentials: "include",
    });
  }

  function deleteSession()  {
    return fetch("http://localhost:8080/session", {
      method: "DELETE",
      credentials: "include",
    });
   
  }
  

  
  var app = new Vue({
    el: '#app',
    data: {
      itemName: '',
      itemPrice: '',
      itemOwner: '',
      itemCategory: '',
      itemDescription: '',
      image: '',
      currentUser: '',
      email: '',
      user: '',
      password: '',
      activityMake: false,
      toolMake: false,
      technolgyMake: false,
      activityId: '605abd878edeb76514f279c5',
      toolId: '605abda98edeb76514f279c6',
      technologyId: '605abdb48edeb76514f279c7',
      currentLogin: '',
      imageLoc: '',
      currentId: '',
      itemBought: false,
      activityimg: false,
      technologyimg: false,
      signEmail: "",
      signUserInput: "",
      signPassword: "",
      toolimg: false,
      rentShow: false,
      loginEmail: "",
      loginPassword: "",
      categoryType: '',
      categoryInput: '',
      userInput: '',
      userIn: false,
      newActivity: {},
      items: [],
      currentItem: null,
      // UI state
      addMode: false,
      errorMessages: []
    },
    methods: {
      addItem: function () {
        this.addMode = true;
      },
      addActivity: function () {
        // This is the activity id
       // 605abd878edeb76514f279c5
       this.checkLoggedIn();
       if(this.userIn) {
        this.activityMake = true;
        this.toolMake = false;
        this.technologyMake = false;
        this.currentId = "605abd878edeb76514f279c5";
        this.categoryInput = "605abd878edeb76514f279c5";
        this.userInput = this.user;
        this.addItem()
       }
      },
      addTool: function () {
        // This is the tool id
        // 605abda98edeb76514f279c6
        this.checkLoggedIn();
        if(this.userIn) {
          this.activityMake = false;
          this.toolMake = true;
          this.technologyMake = false;
          this.currentId = "605abda98edeb76514f279c6";
          this.categoryInput = "605abda98edeb76514f279c6";
          this.userInput = this.user;
          this.addItem()
        }
      },
      addTechnology: function () {
      // This is the techonology id
      // 605abdb48edeb76514f279c7
       this.checkLoggedIn();
        if(this.userIn) {
          this.activityMake = false;
            this.toolMake = false;
            this.technologyMake = true;
            console.log("THIS IS THE USER", this.user);
            this.currentId = "605abdb48edeb76514f279c7";
            this.categoryInput = "605abdb48edeb76514f279c7";
            this.userInput = this.user;
            this.addItem()
        }
      },
      displayActivities: function () {
        this.checkLoggedIn();
        if(this.userIn) {
          this.activityimg = true;
          this.toolimg = false;
          this.technologyimg = false;
          this.currentId = "605abd878edeb76514f279c5";
          this.loadItems()
        }
      },
      displayTools: function () {
        this.checkLoggedIn();
        if(this.userIn) {
          this.activityimg = false;
          this.toolimg = true;
          this.technologyimg = false;
          this.currentId = "605abda98edeb76514f279c6";
          this.loadItems()
        }
      },
      displayTechnologies: function () {
        this.checkLoggedIn();
        if(this.userIn) {
          this.activityimg = false;
          this.toolimg = false;
          this.technologyimg = true;
          this.currentId = "605abdb48edeb76514f279c7";
          this.loadItems()
        }
      },
      validateItem: function () {
        // this will validate the item inputs
        this.errorMessages = [];
  
        if (this.itemSize.length() == 0) {
          this.errorMessages.push("Please specify name.");
        }
        if (this.itemPrice.length() == 0) {
          this.errorMessages.push("Please specify price.");
        }
  
        return this.errorMessages == 0;
      },
      signUser: function () {
        createUserOnServer({
          email: this.signEmail,
          user: this.signUserInput,
          plainPassword: this.signPassword,
        }).then( (response) => {
          if (response.status == 201) {
            alert("User Created" + this.signEmail);
          } else {
            alert("User not created" + this.signEmail);
          }
        }); 
        this.signEmail = "";
        this.signFirst = "";
        this.signLast = "";
        this.signUserInput = "";
        this.signPassword = "";
      },
      loginUser: function () {      
          authenticateUser( this.loginEmail, this.loginPassword
          ).then( (response) => {
            if (response.status == 201) {
              this.checkLoggedIn();
              this.currentLogin = "Logout"
            } else {
              alert("User not authenticated");
            }
          }); 
          this.signEmail = "";
          this.signFirst = "";
          this.signLast = "";
          this.signPassword = "";
      },
      logoutUser: function () {
        // deleteSession();
        deleteSession().then((response) => {
          location.reload();
        });
      },
      submitNewItem: function () {
        // send the data to the server
        // this.checkLoggedIn();
        // if(this.userIn) {
        //   this.newActivity = {name: this.itemName,
        //   price: this.itemPrice,
        //   owner: this.user,
        //   description: this.itemDescription,
        //   category: this.currentId};

        //   this.itemName= "";
        //   this.itemPrice = "";
        //   this.itemOwner = "";
        //   this.itemDescription = "";
        //   this.itemCategory = "";
        //   this.addMode = false;
        // }
        var button = document.getElementById("submitFormButton");
        button.click();

      },
      checkLoggedIn: function () {
        getSession().then(response => {
          if (response.status == 401) {
            console.log("Not Logged in");
            this.currentLogin = "Login";
            this.userIn = false;
          }
          else if (response.status == 200) {
            console.log("User is Logged in");
            this.currentLogin = "Logout";
            this.userIn = true;
          }
          response.json().then(myuser => {
            this.user = myuser._id;
            console.log(this.user);
          });
        });
      },
      loadItems: function () {
        getItemsFromServer(this.currentId).then((response) => {
          response.json().then((data) => {
            this.items = data;
          });
        });
      },
      closeItemDetails: function () {
        this.currentItem = null;
      },
      showItemDetails: function (item) {
        this.currentItem = item;
      },
      editItem: function (item) {
        console.log("we want to edit this item:", item);
      },
      removeItem: function (item) {
        console.log("we want to remove this item:", item);
      },
      rentItem: function (item) {
        console.log(item.image)
        console.log(document.forms[0])
        var script = document.getElementById("stripescript");
        script.setAttribute("data-amount", item.price);
        console.log(script.getAttribute("data-amount"), "this is the value");
        document.getElementsByClassName('stripe-button-el')[0].click();
        document.getElementsByClassName('rent-button')[0].click();
      }
    },
    created: function () {
      this.checkLoggedIn();
    }
  });
  

// window.onload = function() {
//   var image = document.getElementById("uploadImage");
//   var imagesplit = image.src.split("/");
//   var name = imagesplit[4];
//   console.log(name)
//   if(image != null) {
//     app.imageLoc = image.src;
//     console.log(image.src);
//     createItemOnServer({
//       name: app.itemName,
//       price: app.itemPrice,
//       owner: app.user,
//       description: app.itemDescription,
//       image: image.src,
//       category: app.currentId,
//     }).then((response) => {
//       if (response.status == 201) {
//         // this.loadItems();
//       } else {
//         alert("Load items failed!");
//       }
//     });
//   }
// };