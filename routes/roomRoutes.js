const { Router } = require("express");
const { createRoom, getRooms, updateRoom, deleteRoom, getRoom } = require('../controller/roomController')
const { auth } = require('../middleware/authMiddleware')

const router = Router();

// get all rooms
router.get("/", getRooms);

// create room
router.post("/",  createRoom);

// get single room
router.get("/:id", getRoom);

//update room
router.put("/:id", auth, updateRoom);

// delete room
router.delete("/:id", auth, deleteRoom);

module.exports = router;