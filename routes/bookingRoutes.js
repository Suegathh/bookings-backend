const { Router } = require("express");
const { getBookings, createBooking, getBooking, updateBooking, deleteBooking } = require("../controller/bookingController");
const { auth } = require("../middleware/authMidlleware");


const router = Router();

router.get("/", auth, getBookings);
router.post("/", createBooking);
router.get("/:id", auth, getBooking);
router.put("/:id", auth, updateBooking);
router.delete("/:id", auth, deleteBooking);

module.exports = router;
