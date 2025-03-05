const Booking = require("../models/bookingModel");

// Get all bookings
const getBookings = async (req, res, next) => {
  try {
    console.log("Fetching all bookings...");
    const bookings = await Booking.find().populate("roomId");
    
    console.log("Bookings found:", bookings); // Debugging

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found" });
    }

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error); // Debugging
    next(error);
  }
};

// Create a booking
const createBooking = async (req, res, next) => {
  try {
    console.log("📥 Received Booking Data:", req.body); // Debugging

    if (!req.body.roomId || !req.body.userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const booking = await Booking.create(req.body);

    return res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};


// Update a booking
const updateBooking = async (req, res, next) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate("roomId");

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json(updatedBooking);
  } catch (error) {
    next(error);
  }
};

// Delete a booking
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    return res.status(200).json({ message: "Booking deleted", id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// Get a single booking by ID
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("roomId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};
const getBookingsByUser = async (req, res, next) => {
  try {
    console.log("Fetching bookings for user ID:", req.params.userId);
    console.log("Full request details:", {
      params: req.params,
      query: req.query,
      body: req.body,
      user: req.user // If you're using authentication middleware
    });

    const bookings = await Booking.find({ userId: req.params.userId })
      .populate({
        path: 'roomId',
        select: 'name images' // Select specific fields from room
      })
      .sort({ createdAt: -1 }); // Sort by most recent first

    console.log("Found Bookings:", {
      count: bookings.length,
      bookings: bookings.map(b => ({
        _id: b._id,
        roomName: b.roomId?.name,
        checkInDate: b.checkInDate,
        checkOutDate: b.checkOutDate
      }))
    });

    if (!bookings.length) {
      return res.status(404).json({ 
        message: "No bookings found for this user",
        userId: req.params.userId 
      });
    }

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", {
      userId: req.params.userId,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};


module.exports = {
  getBookings,
  createBooking,
  updateBooking,
  getBookingsByUser,
  deleteBooking,
  getBooking,
};
