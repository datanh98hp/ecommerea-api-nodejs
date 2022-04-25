const express = require('express')

const app = express();

require('dotenv/config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const api = process.env.API_URL;
const morgan = require('morgan')
const cors = require('cors')
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

//router
const productRouters = require('./routers/products')
const categoriesRouters = require('./routers/categories')
const userRouters = require('./routers/users')
const ordersRouters = require('./routers/orders');




// middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.options('*',cors())
app.use(authJwt());
app.use(errorHandler)

//Router
app.use(`${api}/products`, productRouters)
app.use(`${api}/categories`, categoriesRouters)
app.use(`${api}/orders`, ordersRouters)

app.use(`${api}/users`, userRouters)

// connect to Mongoose
mongoose.connect(process.env.CONNECTION_STRING,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbName:'eshop-database'
})
    .then(()=>{
        console.log('DB connection is ready....')
    }).catch((err)=>{
        console.log(err)
    })


// 
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    // console.log(api)
    console.log(`Server is running http://localhost:${PORT}`)
})