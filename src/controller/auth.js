require('dotenv').config();

const Logindata = require('../model/login');

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const crypto = require('crypto');
const smsKey = process.env.SMS_SECRET_KEY;
const twilioNum = process.env.TWILIO_PHONE_NUMBER;
const jwt = require('jsonwebtoken');

const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
let refreshTokens = [];


const login = (req, res) => {
    console.log('login : phone :', req.body) //phonenumber,roletype
    const phone = req.body.phonenumber;
    var details = [];
    const otp = Math.floor(100000 + Math.random() * 900000);
    const ttl = 2 * 60 * 1000; //2minutes
    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires}`;
    const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
    const fullHash = `${hash}.${expires}`;

    Logindata.find({ phonenumber: phone }).then((response) => {
        console.log("response :", response)
        if (response.length == 0) {
            Logindata(req.body).save().then((respo) => {
                console.log('new member added !!', respo);
                details = respo
                res.status(200).send({ phone, hash: fullHash, details: respo, msg: "register", otp: otp });
            })
        } else { res.status(200).send({ phone, hash: fullHash, details: response, msg: "login", otp: otp }); }
    })

    //send sms with twilio
    client.messages
        .create({
            body: `Your One Time  Password For ARCLIF is ${otp}`,
            from: twilioNum,
            to: phone
        })
        .then((messages) => {
            console.log(messages);
            res.status(200).send({ msg: "OTP send successfully!!", otp: otp });
        })
        .catch((err) => {
            console.error(err);
            res.status(404).send({ msg: "twillio error!!" });
        })

    // res.status(200).send({ phone, hash: fullHash, otp });  // this bypass otp via api only for development instead hitting twilio api all the time
    // res.status(200).send({ phone, hash: fullHash ,details:details});          // Use this way in Production
};
const verifyOTP = (req, res) => {
    console.log('verifyOTP: ', req.body)
    const phone = req.body.phonenumber;
    const hash = req.body.hash;
    const otp = req.body.otp;
    let [hashValue, expires] = hash.split('.');

    let now = Date.now();
    if (now > parseInt(expires)) {
        return res.status(504).send({ msg: 'Timeout. Please try again' });
    }
    let data = `${phone}.${otp}.${expires}`;
    let newCalculatedHash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
    if (newCalculatedHash === hashValue) {
        console.log('user confirmed');
        //jwt authentication
        const accessToken = jwt.sign({ data: phone }, JWT_AUTH_TOKEN, { expiresIn: '30s' });
        const refreshToken = jwt.sign({ data: phone }, JWT_REFRESH_TOKEN, { expiresIn: '1y' });
        refreshTokens.push(refreshToken);
        res
            .status(202)
            .cookie('accessToken', accessToken, {
                expires: new Date(new Date().getTime() + 30 * 1000),
                sameSite: 'strict',
                httpOnly: true
            })
            .cookie('refreshToken', refreshToken, {
                expires: new Date(new Date().getTime() + 31557600000), //1 year
                sameSite: 'strict',
                httpOnly: true
            })
            .cookie('authSession', true, { expires: new Date(new Date().getTime() + 30 * 1000), sameSite: 'strict' })
            .cookie('refreshTokenID', true, {
                expires: new Date(new Date().getTime() + 31557600000),
                sameSite: 'strict'
            })
            .send({ msg: 'Device verified' });

    } else {
        console.log('not authenticated');
        return res.status(400).send({ verification: false, msg: 'Incorrect OTP' });
    }
}
const home = (req, res) => {
    console.log('home private route');
    res.status(202).send('Private Protected Route - Home');
}

async function authenticateUser(req, res, next) {
    const accessToken = req.cookies.accessToken;

    jwt.verify(accessToken, JWT_AUTH_TOKEN, async (err, phone) => {
        if (phone) {
            req.phone = phone;
            next();
        } else if (err.message === 'TokenExpiredError') {
            return res.status(403).send({
                success: false,
                msg: 'Access token expired'
            });
        } else {
            console.log(err);
            return res.status(403).send({ err, msg: 'User not authenticated' });
        }
    });
}

const refresh = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(403).send({ message: 'Refresh token not found, login again' });
    if (!refreshTokens.includes(refreshToken))
        return res.status(403).send({ message: 'Refresh token blocked, login again' });

    jwt.verify(refreshToken, JWT_REFRESH_TOKEN, (err, phone) => {
        if (!err) {
            const accessToken = jwt.sign({ data: phone }, JWT_AUTH_TOKEN, {
                expiresIn: '30s'
            });
            return res
                .status(200)
                .cookie('accessToken', accessToken, {
                    expires: new Date(new Date().getTime() + 30 * 1000),
                    sameSite: 'strict',
                    httpOnly: true
                })
                .cookie('authSession', true, {
                    expires: new Date(new Date().getTime() + 30 * 1000),
                    sameSite: 'strict'
                })
                .send({ previousSessionExpired: true, success: true });
        } else {
            return res.status(403).send({
                success: false,
                msg: 'Invalid refresh token'
            });
        }
    });
}

const logout = (req, res) => {
    console.log("logout");
    res
        .clearCookie('refreshToken')
        .clearCookie('accessToken')
        .clearCookie('authSession')
        .clearCookie('refreshTokenID')
        .send('logout');
}


module.exports = {
    login,
    verifyOTP,
    home,
    authenticateUser,
    refresh,
    logout
}