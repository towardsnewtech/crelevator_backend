const nodemailer = require('nodemailer');

exports.sendEmail = async (uuidstr, email, smtpInfo, message) => {
    const subject = 'Message from CrElevator';
    const link = `https://crelevator.com/password_reset/${uuidstr}`;
    const html = `<html>
                    <body>
                        <h1>${message}</h1><br/>
                        <a href='${link}' target='_blank' style='padding: 10px 14px; background-color: rgb(0, 107, 107); color: white; border-radius: 4px; text-decoration: none; text-transform: uppercase;'></a>
                    </body>
                </html>`;

    let transport = nodemailer.createTransport({
        host: smtpInfo.emailserver,
        port: 587,
        auth: {
            user: smtpInfo.emailuser,
            pass: smtpInfo.password
        }
    })

    var mailOptions = {
        from: `CR Elevator Supply <${smtpInfo.email}>`, // sender address
        to: email, // list of receivers
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
}