const db = require('../model/index');

const Cart = db.Cart;

exports.addCart = async (req, res) => {
    try {
        const { userid, productid } = req.body;
        console.log(req.body);

        Cart.findOne({
            where: {
                userid, productid
            }
        }).then(cart => {
            console.log(cart)
            if (cart) {
                return res.status(200).json({ success: false })
            } else {
                Cart.create({
                    userid,
                    productid
                }).then(cart => {
                    res.status(200).json({ success: true });
                });
            }
        })
    } catch (error) {
        console.log(error);
    }
}

exports.getCart = async (req, res) => {
    try {
        Cart.findAll({
            include: [
                {
                    model: db.User,
                    required: false 
                },
                {
                    model: db.Product,
                    required: false
                }
            ]
        }).then(carts => {
            res.status(200).json({ success: true, carts })
        })
    } catch (error) {
        console.log(error);
    }
}

exports.removeCart = async (req, res) => {
    try {
        const { id } = req.body;
        console.log(req.body) ;

        Cart.findOne({
            where: {
                id: id
            }
        }).then(cart => {
            if (cart) {
                Cart.destroy({
                    where: {
                        id: id
                    }
                }).then(result => {
                    res.status(200).json({ success: true });
                })
            }
        });
    } catch (error) {
        console.log(error);
    }
}