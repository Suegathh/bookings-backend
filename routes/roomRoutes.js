const { Router } = require("express");
const { getRooms, createRoom, updateRoom, deleteRoom, getRoom } = require("../controller/roomController");
const { auth } = require("../middleware/authMidlleware");

const router = Router();

//get all rooms
router.get("/", getRooms)

//create rooms
router.post("/",  createRoom)

//single room
router.get("/:id", getRoom)

//update room
router.put("/:id", updateRoom)

//delete room
router.delete("/:id", deleteRoom)
module.exports = router;