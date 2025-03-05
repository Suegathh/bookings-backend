const Room = require("../models/roomModel"); // Ensure you have the correct model

// ✅ Create a Room
const Room = require("../models/roomModel");

// ✅ Create a Room
const createRoom = async (req, res) => {
  try {
    console.log('Create Room Request Body:', req.body);
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    console.error('Create Room Error:', error);
    res.status(400).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
};

// ✅ Get All Rooms (Enhanced Logging)
const getRooms = async (req, res) => {
  try {
    console.log('Get Rooms Request Headers:', req.headers);
    console.log('Incoming Request Origin:', req.headers.origin);
    console.log('Request Method:', req.method);

    const rooms = await Room.find();
    
    console.log('Rooms Found:', rooms.length);
    
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Get Rooms Error:', error);
    res.status(500).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
};

// ✅ Get a Single Room
const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update a Room
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete a Room
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ **Export the Functions AFTER Defining Them**
module.exports = { createRoom, getRooms, getRoom, updateRoom, deleteRoom };
