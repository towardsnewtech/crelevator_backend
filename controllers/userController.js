const config = require('../config');
const bcrypt = require('bcryptjs');
const db = require('../model/index');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require("sequelize");
const Buffer = require('buffer').Buffer;
const fs = require('fs');
const path = require('path');
const uuid = require('uuid') ;
const { sendEmail } = require('../common');

const User = db.User;
const UserAddress = db.UserAddress;
const EmailSet = db.EmailSet;

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
    
    const newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        account_type: req.body.account_type
    };
    const encryptedPassword = await bcrypt.hash(newUser.password, 10);

    const data = await User.findAll({ where: { email: req.body.email } })
    if (data.length !== 0) {
        return res.json({ success: false, msg: "This email already exists." })
    }
    const emailverifytoken = uuid.v4() ;

    newUser.password = encryptedPassword;
    newUser.emailverifytoken = emailverifytoken;
    const newCreateUser = await User.create(newUser);

    await UserAddress.create( {
        user_id: newCreateUser.id,
        photo: imagedata != 'no image' ? imageName + ".png" : ''
    });

    const responseUser = {
        id: newCreateUser.id,
        first_name: newCreateUser.first_name,
        last_name: newCreateUser.last_name,
        email: newCreateUser.email,
        emailverifytoken: emailverifytoken
    }

    EmailSet.findOne({where: {isused : true}}).then(data => {
        if (data.dataValues.type == 1) {
            sendEmail(emailverifytoken, req.body.email, data.dataValues, 'Click below link to verify your email for crelevator.com')
            return res.status(200).json({ success: true, data: responseUser, type: data.dataValues.type })
        }
    })
    
    return res.status(200).json({ success: true, data: responseUser, type: 0 })
}

exports.signIn = (req, res) => {
    const { email, password } = req.body;
    try {
        User.findOne(
            {
                include: [{
                    model: db.UserAddress,
                    required: false // use left join
                }],
                where: { email: email }
            }
        ).then(async (user) => {
            if (user) {
                if (user.isemailverified == false) {
                    return res.json({ success: false, msg: 'Please verify your email!' })
                }
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
        User.update({
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
        User.update({
            id: id,
            password: encryptedPassword,
        }, { where: { id: id }}).then(user => {
            res.json({success: true}); 
        });
    } catch (err) {
        res.json({success: false, msg: err});
    }
}

exports.getAddress = (req, res) => {
    const { user_id } = req.body;
    try {
        UserAddress.findOne({where: { user_id: user_id }}).then(address => {
            res.json({address: address, success: true});
        })
    } catch (err) {
        res.json({ success: false, msg: err});
    }
}

exports.updateAddress = (req, res) => {
    const { user_id, company, address_first, address_second, country, city, state, phone, postcode } = req.body;
    try {
        UserAddress.update({
            company: company,
            address_first: address_first,
            address_second: address_second,
            country: country,
            city: city,
            state: state,
            phone: phone,
            postcode: postcode,
        }, { where: { user_id: user_id }}).then(address => {
            res.json({success: true}); 
        });
    } catch (err) {
        res.json({success: false, msg: err});
    }
}

exports.forgotPassword = async (req, res) => {
    
    const { email } = req.body;
    var resetpasswordtoken = uuid.v4();
    
    await User.update({
        resetpasswordtoken
    }, {where: { email: email }}).then(async (user) => {
        if(user == 1) {
            data = await EmailSet.findOne({where: {isused : true}})
            if (data.dataValues.type == 1) {
                sendEmail(resetpasswordtoken, email, data.dataValues, 'Click below link to reset your password for crelevator.com')
                return res.json({ success: true, type: 1 })
            }

            res.json({success: true, resetpasswordtoken, type: 0});
        } else {
            res.json({success: false, msg: 'Email Not Exist!', type: -1});
        }
    })
}

exports.verifyEmailForPassword = async (req, res) => {
    
    const { id } = req.body;

    await User.findOne({where: { resetpasswordtoken: id }}).then(async (user) => {
        if(user) {
            res.json({success: true});
        } else {
            res.json({success: false});
        }
    })
}

exports.resetPassword = async (req, res) => {
    const {id,password} = req.body
    const encryptedPassword = await bcrypt.hash(password, 10);
    let user = await User.findOne({where: { resetpasswordtoken: id }});
    
    if(!user){
        res.json({ success: false, msg: "Incorrect Email"});
    }else{
        await User.update({password:encryptedPassword}, {
            where: { resetpasswordtoken: id }
        })
        res.json({success:true, msg:"New Password set Successfully!"})
    }
   
}

exports.getUsers = async (req, res) => {
    User.findAll().then(users => {
        res.status(200).json({ success: true, users: users });
    });
}

exports.deleteUsers = async (req, res) => {
    try {
        const { ids } = req.body;
    
        const result = await User.destroy({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        });
    
        const result2 = await UserAddress.destroy({
            where: {
                user_id: {
                    [Op.in]: ids
                }
            }
        });
    
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not delete users' });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { id } = req.body;

        var user = await User.findOne({where: {emailverifytoken: id}})
        const token = jwt.sign(
            { id: user.id, email: user.email },
            "myScrt",
            {
                expiresIn: "16h",
            }
        );

        await User.update({
            isemailverified: true
        }, { where: { emailverifytoken: id }}).then(() => {
            res.json({
                success: true, 
                data: {
                    id: user.id, 
                    email: user.email, 
                    first_name: user.first_name, 
                    last_name: user.last_name
                },
                token: token
            });
        });

    } catch (error) {
        console.log(error) ;
    }
}

exports.UpdateEmailInfo = async (req, res) => {
    try {
        if (req.body.type == true) {
            EmailSet.update({
                isused: false
            }, { where: { type: 0 }})

            EmailSet.update({
                email: req.body.email
            }, {where: { type: 0 }})

            EmailSet.update({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                emailserver: req.body.emailserver,
                emailuser: req.body.emailuser,
                isused: true
            }, { where: { type: 1 }}).then(user => {
                console.log(user);
                res.json({success: true});
            });
        } else {
            EmailSet.update({
                isused: false
            }, { where: { type: 1 }})

            EmailSet.update({
                isused: true
            }, { where: { type: 0 }}).then(user => {
                res.json({success: true});
            })
        }

    } catch (error) {
        console.log(error) ;
    }
}

exports.LoadEmailInfo = async (req, res) => {
    try {
        
        EmailSet.findOne({where: {isused: true}}).then(data => {
            res.json({success: true, data: data.dataValues})
        })

    } catch (error) {
        console.log(error) ;
    }
}

exports.LoadSMTPInfo = async (req, res) => {
    try {
        
        EmailSet.findOne({where: {type: 1}}).then(data => {
            res.json({success: true, data: data.dataValues})
        })

    } catch (error) {
        console.log(error) ;
    }
}