const {expressjwt} = require('express-jwt')
const api = process.env.API_URL
function authJwt(){
    const secret = process.env.secretString
    return expressjwt({ secret: secret, algorithms: ["HS256"] }).unless({ //loai tru path k ap dung authorized
        path: [
            {url: /\/api\/v1\/products(.*)/,method:['GET','OPTIONS']},
            { url: /\/api\/v1\/categories(.*)/, method: ['GET', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    })
    
}
module.exports = authJwt;