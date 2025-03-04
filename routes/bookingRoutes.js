const { Router } = require("express");
const { auth } = require('../middleware/authMidlleware')

const { 
    getBooking, 
    getBookings,
    createBooking,
    deleteBooking,
    updateBooking, 
}= require('../controller/bookingController')

const router = Router();

router.get("/", auth, getBookings);
router.get("/:id", getBooking);
router.post("/", createBooking);
router.put("/:id", auth, updateBooking);
router.delete("/:id", auth, deleteBooking);

module.exports = router;