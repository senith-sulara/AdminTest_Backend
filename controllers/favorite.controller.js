const Cart = require('../models/favorite.model');
const Product = require('../models/product.model');
const Router = express.Router();

Router.get("/favItems", async (req,res) => {
    try{
        let cart = await Cart.find({});
        if(cart && cart.items.length>0){
            res.send(cart);
        }
        else{
            res.send(null);
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

Router.post(
    "/addtoFave/:id", async (req,res) => {
    const { productId, quantity } = req.body;

    try{
        let cart = await Cart.find({});
        let item = await Product.findOne({_id: productId});
        if(!item){
            res.status(404).send('Product not found!')
        }
        const price = item.price;
        const name = item.title;
        
        if(cart){
            let itemIndex = cart.items.findIndex(p => p.productId == productId);

            // Check if product exists or not
            if(itemIndex > -1)
            {
                let productItem = cart.items[itemIndex];
                productItem.quantity += quantity;
                cart.items[itemIndex] = productItem;
            }
            else {
                cart.items.push({ productId, name, quantity, price });
            }
            cart.bill += quantity*price;
            cart = await cart.save();
            return res.status(201).send(cart);
        }
        else{
            // no cart exists, create one
            const newCart = await Cart.create({
                items: [{ productId, name, quantity, price }],
            });
            return res.status(201).send(newCart);
        }       
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});
