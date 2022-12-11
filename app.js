//Mr.CRUD
//New app todolist v-1                   05/12/2022

//configuracion inicial
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const app = express();
const date = require(__dirname+"/date.js");
let day = date.getDate();
//-----
var newItem = [];
let workItems = [];
app.set("view engine", "ejs");

//codigo

app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(express.static("static"));

app.get("/", function(req, res) {


  res.render("list", {
    listTitle: day,
    newListItem: newItem
  });
});

app.post("/", function(req, res) {
  let item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item)
    res.redirect("/work");
  } else {
    newItem.push(item);
    res.redirect("/");
  }

  //res.render("list",{newListItem: newItem});
});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItem: workItems
  })
});

app.post("/work", function(req, res) {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Running in port 3000");
});
