const keys = require('../keys');

module.exports = function(email,token){
    return{
            to: email,
            from: keys.EMAIL_FROM,
            subject:'Created a new password',
            html: `
            <h1> Greet to see you </h1>
            <a href="${keys.BASE_URL}/auth/password/${token}" >Recover your password</a>
            `
    };
};