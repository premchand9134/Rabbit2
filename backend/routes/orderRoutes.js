const express = require('express');
const Order = require('../models/order'); // Adjust the path as necessary   
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/orders/my-orders
// @desc    Get logged-in user's orders
// @access  Private 

router.get('/my-orders', protect, async (req, res) => {

    try {
        // Find orders for the logged-in user
        const orders = await Order.find({ user: req.user._id }).sort({
            createdAt: -1
        })  // sort by most recent orders

        res.json(orders);

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
        
    }
})


// @route   GET /api/orders/:Id
//  @desc    Get order details by ID
// @access  Private

router.get('/:id', protect, async (req, res) => {    

    try {
        // Find the order by ID and populate user details
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
    
        res.json(order);

    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Server error' });
    }
})


module.exports = router;

