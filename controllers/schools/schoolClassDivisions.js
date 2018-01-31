let _ = require('lodash');
var config = require('../../knexfile');
var knex = require('knex')(config);
var knexnest = require('knexnest');
var async = require('async');


/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 23 Jan 2018,
 * @PARAMS: req, res, next
 *
 */
exports.index = async function (req, res, next) {
    req.assert('school_id', 'School id cannot be blank').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }
    try {
        
        
        var query = knex.from('school_classes as sc')
            .innerJoin('classes as c', 'c.id', 'sc.class_id')
            .innerJoin('divisions as d', 'd.id', 'sc.division_id')
            .where('sc.school_id', req.params.school_id)
            .where('sc.is_enabled', 'true')
            //TODO: Add where for academic year
            .select(
            [
                'c.id as _id',
                'c.name as _name',
                'c.class_type as _type',
                'd.id as _divs__id',
                'd.name as _divs__name'
            ]
            );

         knexnest(query).then((results) => {
            res.status(200).send(results);
        });
    } catch (err) {
        res.status(500).send({ success: false, msg: 'An error occured. Please try again.', error: err });
    }
};