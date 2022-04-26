const {expressjwt} = require('express-jwt')
const res = require('express/lib/response')
const { token } = require('morgan')
const api = process.env.API_URL
function authJwt(){
    const secret = process.env.secretString
    return expressjwt({ 
        secret: secret, 
        algorithms: ["HS256"],
        isRevoked: isRevoked, // kiem tra user-role
        function(req, res) {
            if (!req.auth.admin) return res.sendStatus(401);
            res.sendStatus(200);
        }
    }).unless({ //loai tru path k ap dung authorized
        path: [
            {url: /\/api\/v1\/products(.*)/,method:['GET','OPTIONS']},
            { url: /\/api\/v1\/categories(.*)/, method: ['GET', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    })
    
}
////11 User role
const isRevoked = async (req, payload,done) => {
    // if (!payload.isAdmin) {
    //     done(null,true)
    // }
    // done();
};

module.exports = authJwt;
