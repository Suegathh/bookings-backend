const { Router } = require("express");
const { auth } = require("../middleware/authMiddleware");

const {
  getBooking,
  getBookings,
  getBookingsByUser, // ✅ Add this function
  createBooking,
  deleteBooking,
  updateBooking,
} = require("../controller/bookingController");

const router = Router();

router.get("/", auth, getBookings);
router.get("/user/:userId", getBookingsByUser);  // ✅ Add this route
router.get("/:id", getBooking);
router.post("/", createBooking);
router.put("/:id", auth, updateBooking);
router.delete("/:id", auth, deleteBooking);

module.exports = router;
