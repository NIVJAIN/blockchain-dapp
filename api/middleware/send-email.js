var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://ngpblockchain@gmail.com:$iloveGermany1980@smtp.gmail.com');


nodemailer.SMTP = {
    host: 'host.com', 
    port:587,
    use_authentication: true, 
    user: 'ngpblockchain@gmail.com', 
    pass: ''
};

const mailOptions__ = {
    from: 'ngpblockchain@gmail.com', // sender address
    to: 'sripal.jain@gmail.com', // list of receivers
    subject: 'Subject of your email', // Subject line
    html: '<p>Your html here</p>',// plain text body
    // attachments: [{'filename': 'attachment.txt', 'content': data}]
};

const SEND_EMAIL = (mailOptions)=>{
    return new Promise((resolve,reject)=>{
        transporter.sendMail(mailOptions, function (err, info) {
            if(err) {
                console.log(err)
                reject(err)
            } else {
                console.log(info);
                resolve(info)
            }
         });
    })
}

// fs.readFile("./attachment.txt", function (err, data) {
//     mailer.send_mail({       
//         sender: 'sender@sender.com',
//         to: 'dest@dest.com',
//         subject: 'Attachment!',
//         body: 'mail content...',
//         attachments: [{'filename': 'attachment.txt', 'content': data}]
//     }), function(err, success) {
//         if (err) {
//             // Handle error
//         }
//     }
// });

module.exports = {
    SEND_EMAIL
}