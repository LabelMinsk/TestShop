const keys = require('../keys');

module.exports = function(email){
    return{
            to: email,
            from: keys.EMAIL_FROM,
            subject:'Created account',
            html: `
            <h1> Greet to see you </h1>
            <p>Your account ${email} has been created</p>
            <hr/>
            <a href="${keys.BASE_URL}" >NodeJS shop</a>
            `
    };
};