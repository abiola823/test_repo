const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const {itemsCollection} = require('../schema/itemSchema');
const {usersCollection} = require('../schema/userSchema');
const {isUserLoggedIn, adminsOnly} = require("./middleware");
const authRoute = require("./auth");
require('dotenv').config();



router.use(isUserLoggedIn);

router.get("/", async (req, res) => {
    const items = await itemsCollection.find({ user: req.decoded.userId });
    res.json(items);
  });
  router.get("/pop", async (req, res) => {
    const items = await itemsCollection.find({ user: req.decoded.userId });
    const lent = items.length
    res.json(lent);
  });
  router.get("/count", async (req, res) => {
    const items = await itemsCollection.distinct("users");
    res.json(items);
  });


  router.post("/add-items", async (req, res) => {
 
    try {
      const {name, description, price, isInStore, } = req.body;
      const newItem = await itemsCollection.create({
        name,
        description,
        price,
        isInStore,
        user: req.decoded.userId
      });
  
      res.json({
        isRequestSuccesful: true,
        newItem
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("internal-server-error");
    }
  });

  router.post("/items", async (req, res) =>{
    await itemsCollection.create({

    });
  });

  router.get("/only-admins/all-items", adminsOnly, async (req, res) => {
    try {
        await itemsCollection.find();
      
    } catch (error) {
      console.log(error)
    }
  });

  router.delete("/delete/:id", async (req,res) => {
    const {id} = req.params;

    const note = await itemsCollection.findById(id);
  
    if(req.decoded.userId != note.user) {
      res.status(401).send("You are not allowed to delete this task");
      return;
    }
  
    await taskCollection.findByIdAndDelete(req.params.id);
    res.send("Task has been deleted sucessfully!");
  });





    module.exports = router;