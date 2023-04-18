const config = require('../config');
const bcrypt = require('bcryptjs');
const db = require('../model/index');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require("sequelize");

const User = db.User;
const UserAddress = db.UserAddress;

exports.signUP = async (req, res) => {
    const email = req.body.email;

    const newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
    };
    const encryptedPassword = await bcrypt.hash(newUser.password, 10);

    const data = await User.findAll({ where: { email: req.body.email } })
    if (data.length !== 0) {
        res.json({ success: false, msg: "This email already exists." })
    }
    newUser.password = encryptedPassword;
    const newCreateUser = await User.create(newUser);

    await UserAddress.create( {
        user_id: newCreateUser.id,
    });

    // Create token
    const token = jwt.sign(
        { user_id: newCreateUser.id, email },
        "myScrt",
        {
            expiresIn: "16h",
        }
    );
    
    const responseUser = {
        id: newCreateUser.id,
        first_name: newCreateUser.first_name,
        last_name: newCreateUser.last_name,
        email: newCreateUser.email,
        token: token,
    }
    res.status(200).json({ success: true, data: responseUser })
}

exports.signIn = (req, res) => {
    const { email, password } = req.body;
    try {
        User.findOne({where: { email: email }}).then(async (user) => {
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

exports.forgotPassword = (req, res) => {
    
    const { email } = req.body;
    User.findOne({where: { email: email }}).then(async (user) => {
        if(user) {
            const toten = crypto.randomBytes(16).toString('hex')
            await User.update({token:toten}, {
                where: { id: user.dataValues.id }
            })
            
            const subject = 'EasyPrez - Demande de modification de mot de passe';
            const link = `https://www.easyprez.fr/resetPW/${toten}`;
            const html = `<div style='text-align: center; max-width: 768px; margin: 0 auto;'> 
                            <p>Bonjour ${user.first_name} ${user.name},</p>
                            <p>Une demande de modification de mot de passe a récemment été faite pour votre compte EasyPrez</p>
                            <p>Cliquez sur ce lien pour modifier le mot de passe.</p>
                            <a href=${link} target='_blank' style='padding: 10px 14px; background-color: rgb(0, 107, 107); color: white; border-radius: 4px; text-decoration: none; text-transform: uppercase;'>Cliquer ici</a>
                        </div>`;

            var transport = nodemailer.createTransport({
                host: config.emailServer, // Amazon email SMTP hostname
                secureConnection: true, // use SSL
                port: 465, // port for secure SMTP
                auth: {
                    user: config.emailUser, // Use from Amazon Credentials
                    pass: config.emailPasswd // Use from Amazon Credentials
                }
            });
            
            var mailOptions = {
                from: config.adminEmail, // sender address
                to: email, // list of receivers
                subject: subject, // Subject line
                html: html // email body
            };

            // send mail with defined transport object
            transport.sendMail(mailOptions, function(error, response){
                if(error){
                    console.log(error);
                }else{
                    res.status(200).json({ success: true, msg: `A verification email has been sent to ${email}.`});
                }

                transport.close(); // shut down the connection pool, no more messages
            });

            res.json({success: true});
        } else {
            res.json({success: false});
        }
    })
}

exports.resetPassword = async (req, res) => {
    const {token,password} = req.body
    const encryptedPassword = await bcrypt.hash(password, 10);
    let user = await User.findOne({where: { token: token }});
    if(!user){
        res.status(401).json({ success: false, msg: "Incorrect Token"});
    }else{
        await User.update({password:encryptedPassword}, {
            where: { id: user.dataValues.id }
          })
          res.json({success:true,msg:"Success reset your Password"})
        
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