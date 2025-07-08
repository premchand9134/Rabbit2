const express = require('express');
const Checkout = require('../models/checkout');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');


const router = express.Router();

// @route   POST /api/checkout
// @desc    Create a new  checkout session
// @access  Private

router.post('/', protect, async (req, res)=>{
    const {checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if(!checkoutItems || ! checkoutItems.lenght === 0){
        return res.status(400).json({ message: 'No items in checkout' });
    };

    try {

        // create a new checkout session
        const newCheckout = await Checkout.create({
            user : req.user._id,
            checkoutItem: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            isPaid: false,
            paymentStatus: 'Pending',    
        })
        console.log(`Checkout created For user: ${req.user._id}`);
        res.status(201).json(newCheckout);

        
    } catch (error) {
        console.error('Error creating checkout:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/checkout/:id/pay
// @desc    Update checkout to mark as paid after successful payment 
// @access  Private

router.put('/:id/pay', protect, async (req,res)=>{
    const { paymentStatus, paymentDetails } = req.body;

    try {

        const checkout = await Checkout.findById(req.params.id)

        if(!checkout) {
            return res.status(404).json({ message: 'Checkout not found' });
        }

        if(paymentStatus === "paid"){
            checkout.isPaid = true;
            checkout.paymentStatus = 'Paid';
            checkout.paidAt =  Date.now();
            checkout.paymentDetails = paymentDetails; // Store payment details like transaction ID, etc.
            await checkout.save();

            res.status(200).json({ message: 'Checkout payment updated successfully', checkout });
        }else{
            res.status(400).json({ message: 'Payment status is not valid' });
        }

        
    } catch (error) {
        console.error('Error updating checkout payment:', error);
        res.status(500).json({ message: 'Server Error' });
        
    }
})

// @route   POST /api/checkout/:id/finalize
// @desc    Finalize  checkout and convert to an order after  payment confirmation
// @access  Private

router.post('/:id/finalize', protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);

        if(!checkout) {
            return res.status(404).json({ message: 'Checkout not found' });
        }

        if(checkout.isPaid && !checkout.isFinalized) {
            //  Create final order based on the  checkout details

            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItem,
                totalPrice: checkout.totalPrice,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: checkout.paymentDetails, // Store payment details like transaction ID, etc.
            })


            // Mark the checkout as finalized
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();
           
            // Delete the cart associated with the checkout
            await Cart.findOneAndDelete({ user: checkout.user });
            res.status(201).json({ message: 'Checkout finalized and order created successfully', order: finalOrder });

        } else if(checkout.isFinalized) {
            return res.status(400).json({ message: 'Checkout is already finalized' });
        } else {
            return res.status(400).json({ message: 'Checkout is not paid yet' });
        }


    } catch (error) {
        console.error('Error finalizing checkout:', error);
        res.status(500).json({ message: 'Server Error' });
    }
})


module.exports = router;