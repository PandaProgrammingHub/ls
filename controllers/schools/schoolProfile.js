var schoolController = require('../school');


/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 2 Jan 2018,
 * @PARAMS: req, res, next
 *
 */
exports.editProfile = function (req, res, next) {
    delete req.body.name;
    delete req.body.school_type;
    delete req.body.cluster;
    delete req.body.acadyear;
    delete req.body.school_chain;
    delete req.body.city;
    delete req.body.state;
    delete req.body.pincode;
    
    return schoolController.updateSchool(req, res, next);

}