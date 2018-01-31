
var validationAssert = function(req){

    switch(req){
        case req.mobile :
                         req.assert('mobile', 'Invalid Mobile Number Format').isLength( {min: 10, max:10} );
                         break;
        case req.email : 
                         req.assert('email', 'Email is not valid').isEmail();
                         req.assert('email', 'Email cannot be blank').notEmpty();
                         break;
        case req.password :
                         req.assert('password', 'Password cannot be blank').notEmpty();
                         break;
                         
    }
    return req;

};
module.exports = {validationAssert};




