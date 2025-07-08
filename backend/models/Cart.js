const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    name : String,
    image : String,
    price : String,
    size : String,
    color : String,
    quantity : {
        type: Number,
        default: 1
    },
},
{
    _id: false,
})

const cartSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    guestId : {
        type: String,
    },
    products : [cartItemSchema],
    totalPrice : {
        type: Number,
        default: 0,
        required : true
    },

},
{    timestamps: true,}
)

module.exports = mongoose.model('Cart', cartSchema);