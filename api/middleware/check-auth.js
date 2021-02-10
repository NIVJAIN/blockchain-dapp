const jwt = require('jsonwebtoken')
const CONFIG = require('../../config/config')


const HEADER_AUTH = (req,res,next)=>{
    try {     
	    if(req.headers.authorization !== undefined){
            const token = req.headers.authorization.split(" ")[1];
            console.log("Toenlll", token)
            const decoded = jwt.verify(token,CONFIG.JWT_SECRET);
            req.userData = decoded;
            next()
	    }
	     else {
            return res.status(401).json({
                error: "Authfailed-1"
            })
        }

    } catch(err){
       console.log("Auth failed", err)
	    return res.status(401).json({
            error: "Authfailed-2"
        })
    } 
}

const QUERY_AUTH = (req,res,next)=>{
    try {
        if(req.query.token) {
            // const token = req.headers.authorization.split(" ")[1];
            console.log("req.query.token ======= >>>>>>>", req.query.token)
            const token = req.query.token;
            const decoded = jwt.verify(token,CONFIG.JWT_SECRET);
            req.userData = decoded;
            next()
        } else {
            return res.status(401).json({
                error: "Authfailed-reqquery"
            })
        }

    } catch(err){
       console.log("Auth failed", err)
	    return res.status(401).json({
            error: "Authfailed-2"
        })
    } 
}

const  COOKIE_AUTH2 = (req,res,next)=>{
    //get authcookie from request
    try {
        const authcookie = req.cookies.authcookie
        console.log("CookieAuthsdfasdfasdfasdfsdf========>", authcookie)
        const decoded = jwt.verify(authcookie,CONFIG.JWT_SECRET);
        req.userData = decoded;
        next()
    } catch(error){
        return res.status(401).json({
            error: "CookieAuthFailed"
        })
    }

}

const  COOKIE_AUTH = (req,res,next)=>{
    //get authcookie from request
    const authcookie = req.cookies.authcookie
    console.log("CookieAuthsd    ASDFDSAF     ASDFSDFf========>", authcookie)
    //verify token which is in cookie value
    // const decoded = jwt.verify(authcookie,CONFIG.JWT_SECRET);
    jwt.verify(authcookie,CONFIG.JWT_SECRET,(err,data)=>{
        if(err){
            // res.sendStatus(403)
            return res.status(403).json({
                tokenError: "Forbidden please login"
            })
        } 
        else if(data.email){
            console.log("req.email-data.email", req.cookies.email, data.email)
            req.cookies.email = data.email
            next()
        }
    })
}

module.exports = {
    QUERY_AUTH,
    HEADER_AUTH,
    COOKIE_AUTH
}

// module.exports = (req,res,next)=>{
//     try {
//         console.log("req.headers.authozri", req.headers.authorization)
//         console.log("req.harer.auth", req.headers["authorization"])
//         console.log("req.......asfsfadsfadsfadsfsdf", req.query.token, req.params.token)
//         if(req.query.token) {
//             // const token = req.headers.authorization.split(" ")[1];
//             console.log("req.query.token ======= >>>>>>>", req.query.token)
//             const token = req.query.token;
//             const decoded = jwt.verify(token,CONFIG.JWT_SECRET);
//             req.userData = decoded;
//             next()
//         } else {
//             return res.status(401).json({
//                 error: "Authfailed-reqquery"
//             })
//         }
        
//         console.log("asfdsfsdfdsfsdfs", req.query, req.query.token)
// 	    if(req.headers.authorization !== undefined){
//             const token = req.headers.authorization.split(" ")[1];
//             console.log("Toenlll", token)
//             const decoded = jwt.verify(token,CONFIG.JWT_SECRET);
//             req.userData = decoded;
//             next()
// 	    }
// 	     else {
//             return res.status(401).json({
//                 error: "Authfailed-1"
//             })
//         }

//     } catch(err){
//        console.log("Auth failed", err)
// 	    return res.status(401).json({
//             error: "Authfailed-2"
//         })
//     } 
// }
