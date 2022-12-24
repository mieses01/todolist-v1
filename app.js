//Mr.CRUD
//New app todolist v-1                              05/12/2022
//Add Models and Database CRUD using mongoose v-2   24/12/2022

//configuracion inicial
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
const date = require(__dirname + "/date.js");
let day = date.getDate();
//-----
var newItem = [];
let workItems = [];

app.set("view engine", "ejs");
app.use(express.static("static"));

app.use(bodyparser.urlencoded({
  extended: true
}));


//Database
mongoose.set('strictQuery', true);
// connecting with database
mongoose.connect("mongodb+srv://admin-mrcrud:Manolo1010@cluster0.6kc3gdk.mongodb.net/todolistDB");

//Schema

const itemSchema = {
  name: String
};

//model
const Item = mongoose.model("Item", itemSchema);

//document

const item = new Item({
  name: "Welcome to TodoList 1."
});
const item1 = new Item({
  name: "Welcome to TodoList 2."
});
const item2 = new Item({
  name: "Welcome to TodoList 3!."
});
//array insert
const defaultItems = [item, item1, item2];
//schema y model dinamico
const listSchema = {
  name: String,
  items: [itemSchema]
};
const List = mongoose.model("List", listSchema);
//codigo

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {

      //insert
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/");
          console.log("Inserted!");
        }
      });
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItem: foundItems
      });
    }
  });
});

app.post("/", function(req, res) {

  const ItemName = req.body.newItem;
  const listName = req.body.list;

  const itemName = new Item({
    name: ItemName
  });

  if (listName === "Today") {
    Item.create(itemName, function(err) {
      if (err) {
        console.log("Error al Insertar!.");
      } else {
        res.redirect("/");
      }
    });
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(itemName);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
  //res.render("list",{newListItem: newItem});
});

app.post("/delete", function(req, res) {
  const checkedItem = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {

    Item.findByIdAndRemove(checkedItem, function(err) {
      if (err) {
        console.log("Error Borrando");
      } else {
        console.log("Removed!!");
      }
      res.redirect("/");
    });
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedItem
        }
      }
    }, function(err, foundList) {
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }

});

app.get("/about", function(req, res) {
  res.render("about");
});

//app Dynamic url
app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);  //Change first letter with capitaliza lodash
  List.findOne({
    name: customListName
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save()
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItem: foundList.items
        });
      }
    }
  });

});

app.listen(3000, function() {
  console.log("Running in port 3000");
});
