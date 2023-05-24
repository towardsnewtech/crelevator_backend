const Sequelize = require('sequelize');
const config = require('../config');

const bcrypt = require('bcryptjs');
const db = require('../model/index');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Buffer = require('buffer').Buffer;
const fs = require('fs');
const path = require('path');

const Admin = db.Admin;
const User = db.User;
const UserAddress = db.UserAddress;

exports.signUP = async (req, res) => {
    const { imagedata } = req.body;

    let base64Image = imagedata.split(';base64,').pop();
    let buf = Buffer.from(base64Image, 'base64');
    const imageName = crypto.randomBytes(16).toString("hex");

    if (imagedata != 'no image') {

        fs.writeFile(path.join(__dirname, '../public/images/photo/', imageName + ".png"), buf, function(error) {
            if (error) {
            throw error;
            }
        })
    }

    const email = req.body.email;

    const newAdmin = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        photo: imagedata != 'no image' ? imageName + ".png" : ''
    };
    const encryptedPassword = await bcrypt.hash(newAdmin.password, 10);

    const data = await Admin.findAll({ where: { email: req.body.email } })
    if (data.length !== 0) {
        return res.json({ success: false, msg: "This email already exists." })
    }
    newAdmin.password = encryptedPassword;
    const newCreateAdmin = await Admin.create(newAdmin);

    // Create token
    const token = jwt.sign(
        { user_id: newCreateAdmin.id, email },
        "myScrt",
        {
            expiresIn: "16h",
        }
    );
    
    const responseUser = {
        id: newCreateAdmin.id,
        first_name: newCreateAdmin.first_name,
        last_name: newCreateAdmin.last_name,
        email: newCreateAdmin.email,
        token: token,
    }
    res.status(200).json({ success: true, data: responseUser })
}

exports.signIn = (req, res) => {
    const { email, password } = req.body;
    try {
        Admin.findOne({where: { email: email }}).then(async (user) => {
            if (user) {
                if (await bcrypt.compare(password, user.password)) {
                    // Create token
                    const token = jwt.sign(
                        { user_id: user._id, email },
                        "myScrt",
                        {
                            expiresIn: "16h",
                        }
                    );
                    // user
                    res.json({user, token: token, success: true});
                } else {
                    res.json({ success: false, msg: "The password is incorrect."});
                }
            } else {
                res.json({ success: false, msg: "This email is not existed."});
            }
        })
    } catch (err) {
        return next(err);
    }
}

exports.updateInfo = (req, res) => {
    const { id, email, first_name, last_name } = req.body;
    try {
        Admin.update({
            email: email,
            first_name: first_name,
            last_name: last_name,
        }, { where: { id: id }}).then(user => {
            res.json({success: true}); 
        });
    } catch (err) {
        res.json({success: false, msg: err}); 
        return next(err);
    }
}

exports.changePassword = async (req, res) => {
    const { id, new_password } = req.body;
    const encryptedPassword = await bcrypt.hash(new_password, 10);
    try {
        Admin.update({
            id: id,
            password: encryptedPassword,
        }, { where: { id: id }}).then(user => {
            res.json({success: true}); 
        });
    } catch (err) {
        res.json({success: false, msg: err});
    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    const encryptedPassword = await bcrypt.hash("111", 10);
    Admin.findOne({where: { email: email }}).then(async (user) => {
        if(user) {
            const toten = crypto.randomBytes(16).toString('hex')
            await Admin.update({password: encryptedPassword}, {
                where: { email: email }
            })

            res.json({success: true});
        } else {
            res.json({success: false});
        }
    })
}

exports.resetPassword = async (req, res) => {
    const {token,password} = req.body
    const encryptedPassword = await bcrypt.hash(password, 10);
    let user = await Admin.findOne({where: { token: token }});
    if(!user){
        res.status(401).json({ success: false, msg: "Incorrect Token"});
    }else{
        await Admin.update({password:encryptedPassword}, {
            where: { id: Admin.dataValues.id }
          })
          res.json({success:true,msg:"Success reset your Password"})
        
    }
   
}

exports.getUserinfo = async (req, res) => {
    try {
        await User.findOne(
            {
                include: [{
                    model: db.UserAddress,
                    required: false // use left join
                }],
                where: { id: parseInt(req.body.user_id) }
            }
        )
        .then(async (user) => {
            res.status(200).json({
                status: "success",
                data : user.dataValues
            })
        })
        .catch(err => {
            console.log(err)
        })
    } catch(err){
        console.log(err)
    }
}