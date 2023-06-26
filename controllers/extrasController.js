const db = require('../model/index');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const TrainingVideo = db.TrainingVideo;
const Faq = db.Faq;
const News = db.News;
const Pdf = db.Pdf;
const EmailSet = db.EmailSet;

exports.addTrainingVideo = async (req, res) => {
    const { name, videourl } = req.body;

    TrainingVideo.create({
        name: name,
        videourl: videourl,
    }).then(video => {
        res.status(200).json({ success: true, id: video.id });
    });
}

exports.addFaq = async (req, res) => {
    const { title, content } = req.body;

    Faq.create({
        title: title,
        content: content,
    }).then(faq => {
        res.status(200).json({ success: true, id: faq.id });
    });
}

exports.addNews = async (req, res) => {
    const { title, content } = req.body;

    News.create({
        title: title,
        content: content,
    }).then(news => {
        res.status(200).json({ success: true, id: news.id });
    });
}

exports.addPdf = async (req, res) => {
    const name = req.body.name;
    const type = req.body.type;
    const file = req.files.file;

    const fileName = crypto.randomBytes(16).toString("hex");

    file.mv(`./public/pdfs/${fileName}.pdf`, function (error) {
        if (error) {
            throw error;
        } else {
            Pdf.create({
                name: name,
                type: parseInt(type),
                title: fileName + ".pdf",
            }).then(pdf => {
                res.status(200).json({ success: true, title: 'pdfs/' + fileName + ".pdf", id: pdf.id });
            });
        }
    });
}

exports.getTrainingVideos = async (req, res) => {
    TrainingVideo.findAll().then(videos => {
        res.status(200).json({ success: true, videos: videos });
    }).catch(err => {
        console.log(err);
    });
}

exports.getFaqs = async (req, res) => {
    Faq.findAll().then(faqs => {
        res.status(200).json({ success: true, faqs: faqs });
    }).catch(err => {
        console.log(err);
    });
}

exports.getNews = async (req, res) => {
    News.findAll().then(news => {
        res.status(200).json({ success: true, news: news });
    }).catch(err => {
        console.log(err);
    });
}

exports.getPdfs = async (req, res) => {
    Pdf.findAll().then(pdfs => {
        res.status(200).json({ success: true, pdfs: pdfs });
    }).catch(err => {
        console.log(err);
    });
}

exports.deleteTrainingVideo = async (req, res) => {
    const { id } = req.body;

    TrainingVideo.findOne({
        where: {
            id: id
        }
    }).then(video => {
        if (video) {
            TrainingVideo.destroy({
                where: {
                    id: id
                }
            }).then(result => {
                res.status(200).json({ success: true });
            })
        }
    });
}

exports.deleteFaq = async (req, res) => {
    const { id } = req.body;

    Faq.findOne({
        where: {
            id: id
        }
    }).then(faq => {
        if (faq) {
            Faq.destroy({
                where: {
                    id: id
                }
            }).then(result => {
                res.status(200).json({ success: true });
            })
        }
    });
}

exports.deleteNews = async (req, res) => {
    const { id } = req.body;

    News.findOne({
        where: {
            id: id
        }
    }).then(news => {
        if (news) {
            News.destroy({
                where: {
                    id: id
                }
            }).then(result => {
                res.status(200).json({ success: true });
            })
        }
    });
}

exports.deletePdf = async (req, res) => {
    const { id } = req.body;

    Pdf.findOne({
        where: {
            id: id
        }
    }).then(pdf => {
        if (pdf) {
            fs.unlink(path.join(__dirname, '../public/pdfs/', pdf.title), (err) => {
                if (err) throw err;
                pdf.destroy({
                    where: {
                        id: id
                    }
                }).then(result => {
                    res.status(200).json({ success: true });
                })
            });
        }
    });
}

exports.quoteRequest = async (req, res) => {
    data = await EmailSet.findOne({ where: { isused: true } })
    if (data.dataValues.type == 1) {
        smtpInfo = data.dataValues ;

        const subject = 'QUOTE REQUEST';
        const html = `<h4 style='color: rgb(199, 32, 24); font-size: 24px;'>Quote Form</h4>
                        <div style='max-width: 768px; padding-left: 15px'>
                          <p style='font-size: 16px'>Name: ${req.body.name == undefined ? "" : req.body.name}</p>
                          <p style='font-size: 16px'>Company: ${req.body.company == undefined ? "" : req.body.company}</p>
                          <p style='font-size: 16px'>City: ${req.body.city == undefined ? "" : req.body.city}</p>
                          <p style='font-size: 16px'>Country: ${req.body.country == undefined ? "" : req.body.country}</p>
                          <p style='font-size: 16px'>Email: ${req.body.email == undefined ? "" : req.body.email}</p>
                          <p style='font-size: 16px'>PhoneNumber: ${req.body.phonenumber == undefined ? "" : req.body.phonenumber}</p>
                          <p style='font-size: 16px'>Product: ${req.body.product == undefined ? "" : req.body.product}</p>
                        </div>`;

        let transport = nodemailer.createTransport({
            host: smtpInfo.emailserver,
            port: 587,
            auth: {
                user: smtpInfo.emailuser,
                pass: smtpInfo.password
            }
        })

        var mailOptions = {
            from: `CR Elevator Supply <${req.body.email}>`, // sender address
            to: smtpInfo.email, // list of receivers
            subject: subject, // Subject line
            html: html // email body
        };

        // send mail with defined transport object
        transport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log(`A verification email has been sent to ${email}.`);
            }

            transport.close(); // shut down the connection pool, no more messages
        });
        return res.json({ success: true, type: 1 })
    }
    res.json({ success: true, type: 0, email: data.dataValues.email })
}

exports.cresRequest = async (req, res) => {
    data = await EmailSet.findOne({ where: { isused: true } })
    if (data.dataValues.type == 1) {
        smtpInfo = data.dataValues ;

        const subject = 'CRES INFORMATION REQUEST';
        const html = `<div style='max-width: 768px; padding-left: 15px;'>
                        <h5 style='color: rgb(199, 32, 24); font-size: 20px;'>Your Information</h5>
                        <div style='padding-left: 10px;'>
                            <div style='display: flex;'>
                                <p style='width: 50%; font-size: 16px;'>First Name: ${req.body.firstname == undefined ? "": req.body.firstname}</p> <p style='width: 50%; font-size: 16px;'>Last Name: ${req.body.lastname == undefined ? "": req.body.lastname}</p>
                            </div>
                            <div style='display: flex'>
                                <p style='width: 50%; font-size: 16px;'>Job Title: ${req.body.jobtitle == undefined ? "": req.body.jobtitle}</p> <p style='width: 50%; font-size: 16px;'>State: ${req.body.country == undefined ? "": req.body.country}</p>
                            </div>
                            <div style='display: flex'>
                                <p style='width: 50%; font-size: 16px;'>PhoneNumber: ${req.body.phonenumber == undefined ? "": req.body.phonenumber}</p> <p style='width: 50%; font-size: 16px;'>Email: ${req.body.email == undefined ? "": req.body.email}</p>
                            </div>
                        </div>
                        <h5 style='color: rgb(199, 32, 24); padding-top: 20px; font-size: 20px;'>Company Information</h5>
                        <div style='padding-left: 10px'>
                            <p style='font-size: 16px'>Company: ${req.body.company == undefined ? "": req.body.company}</p>
                            <p style='font-size: 16px'>Number of Elevator Per Month<br/>&nbsp;&nbsp;&nbsp; ${req.body.numofelevator == undefined ? "": req.body.numofelevator}</p>
                            <p style='font-size: 16px'>How Did You Hear About Us?<br/>&nbsp;&nbsp;&nbsp; ${req.body.howhear == undefined ? "": req.body.howhear}</p>
                            <p style='font-size: 16px'>Comment<br/>&nbsp;&nbsp;&nbsp; ${req.body.comment == undefined ? "" : req.body.comment}</p>
                            <p style='font-size: 16px'>Interested in purchasing?<br/>&nbsp;&nbsp;&nbsp; ${req.body.fav_language == undefined ? "": req.body.fav_language}</p><br/>
                        </div>
                    </div>` ;

        let transport = nodemailer.createTransport({
            host: smtpInfo.emailserver,
            port: 587,
            auth: {
                user: smtpInfo.emailuser,
                pass: smtpInfo.password
            }
        })

        var mailOptions = {
            from: `CR Elevator Supply <${req.body.email}>`, 
            to: smtpInfo.email, 
            subject: subject, 
            html: html 
        };
        console.log(req.body.email, smtpInfo)

        // send mail with defined transport object
        transport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log(`A verification email has been sent to ${email}.`);
            }

            transport.close(); // shut down the connection pool, no more messages
        });
        return res.json({ success: true, type: 1 })
    }
    res.json({ success: true, type: 0, email: data.dataValues.email })
}