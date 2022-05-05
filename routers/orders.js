const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');

const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const orderList = await Order.find().populate('user', 'name')
        .sort({ 'dateOrderd': -1 });

    if (!orderList) {
        res.status(500).json({ success: false })
    }
    res.send(orderList);
})

router.get(`/:id`, async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate(
            { path: 'orderItems', populate: { path: 'product', populate: 'category' } })
        .sort({ 'dateOrderd': -1 });

    if (!order) {
        res.status(500).json({ success: false })
    }
    res.send(order);
})
// 

// 

router.post('/', async (req, res) => {
    // tao list orderitem
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    }))
    const orderItemsResolved = await orderItemsIds;
    //
    const totalPrices = await Promise.all(orderItemsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
    }))
 
    const totalPrice = totalPrices.reduce((a,b)=>a + b,0)

    console.log(totalPrice)
    let order = new Order({
        orderItems: orderItemsResolved, //
        shippingAddress1: req.body.shippingAddress1,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    });

    order = await order.save();

    if (!order)
        return res.status(404).send('The order can not created.!');
    res.send(order)
})

// 


router.put('/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status:req.body.status
        },
        { new: true }
    );
    if (!order)
        return res.status(400).send('The order cannot be created !')

    res.send(order);

})
// 

router.delete('/:id', async (req, res) => {
    Order.findByIdAndRemove(req.params.id).then( async order => {
        if (order) {
            await order.orderItems.map( async (orderItem)=>{
                await OrderItem.findOneAndRemove(orderItem)
            }) 
            res.status(200).json({ success: true, message: 'The order is deleted.' })
        } else {
            return res.status(404).json({ success: false, message: 'Order not found.' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err })
    })
    OrderItem.find({product:req})
})
module.exports = router;


/*
{
    "orderItems": [
        {
            "quantity":3,
            "product":"626ccd10818e391e17dce8a9"
        },
        {
            "quantity":3,
            "product":"626ccd10818e391e17dce8a9"
        } 
        ],
    "shippingAddress1": "AL-HP",
    "shippingAddress2": "",
    "city": "HP",
    "zip": "15152",
    "country": "Vn",
    "phone": "0796423400",
    "status": "Pending",
    "totalPrice":0 ,
    "user": "625c3db043b6aa4dc266836b"
   
}

 */