const express = require('express');
const { Category } = require('../models/category');
const {Product} = require('../models/product')
const router = express.Router();
const mongoose  = require('mongoose')
const api = process.env.API_URL;
//route
//http://localhost:3000/api/v1/products?category=02949582494847
router.get(`/`, async (req, res) => {
    // dkien loc du lieu

    let filter = {}
    if(req.query.categories){
       filter = {category: req.query.categories.split(',') }
    }
    //const limitNumber = req.query.limit;
    //const productList = await Product.find(filter).populate('category').limit(limitNumber);
    const productList = await Product.find(filter).populate('category');

    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.send(productList)
})

// FIND
router.get(`/:id`, async (req, res) => {
    const productList = await Product.find(req.params.id).populate('category');

    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.send(productList)
})
//create
router.post(`/`, async(req, res) => {
    const category = await Category.findById(req.body.category)
    console.log(category)
    if(!category) return res.status(400).send('Invalid Category.')

    let product = new Product({
        name:req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: category,
        countInstock: req.body.countInstock,
        rating: req.body.rating,
        numberReviews: req.body.numberReviews,
        isFeatured: req.body.isFeatured,
    });

    product = await product.save();
    console.log(product)
    if(!product) 
    return res.status(500).send('The product cannot created !')
    res.send(product)
});
//update

router.put(`/:id`, async (req, res) => {

    const category = await Category.findById(req.body.category)
    if (!category) return res.status(400).send('Invalid Category.')

    let product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: category,
            countInstock: req.body.countInstock,
            rating: req.body.rating,
            numberReviews: req.body.numberReviews,
            isFeatured: req.body.isFeatured, 
        }, 
        {new:true}
    )

    if (!product) return res.status(500).send('Invalid .')

    product = await product.save();

    if (!product){
        return res.status(500).send('The product cannot updated !')
    }
        
    res.send(product)
});
// delete
router.delete('/:id', (req, res) => {
    //validate the id .
    if ( !mongoose.isValidObjectId(req.params.id) ) {
        res.status(400).send('Invalid or not exist the Product ID.')
    }

     Product.findByIdAndRemove(req.params.id).then(product => {
        if (product) {
            res.status(200).json({ success: true, message: 'The category is deleted.' })
        } else {
            return res.status(404).json({ success: false, message: 'Category not found.' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err })
    })
})

// 
router.get('/get/count',async (req,res)=>{
    const producCount = await Product.countDocuments()

    if (!producCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        count: producCount
    })
})
//  get featured
router.get('/get/featured/:count', async (req, res) => {
    //count must numberic
    const count = req.params.count ? req.params.count : 0
    const producCount = await Product.find({isFeatured:true}).limit(+count)
    if (!producCount) {
        res.status(500).json({ success: false })
    }
    res.send(producCount)
})
module.exports = router;