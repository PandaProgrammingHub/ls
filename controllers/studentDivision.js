var config = require('../knexfile');
var knex = require('knex')(config);
var knexnest = require('knexnest');
var StudentAdmissions = require('../models/studentAdmissions');
var Constants = require('../constants');

/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 24 Jan 2018,
 * @PARAMS: req, res, next
 * Get the school_id
 *  if school_id is blank, null or nan - respond error
 *  The page number
 *  Get the list of students from that school as per page
 *  Return the information
 */
exports.index = function (req, res, next) {
    try {
        req.assert('school_id', 'School id cannot be blank').notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            return res.status(400).send(errors);
        }

        var page = 1;
        var pageSize = 10;

        if (req.query.page) {
            page = req.query.page;
        }


        // if (req.query.pageSize) {
        //   pageSize = req.query.pageSize;
        // }

        var query = knex.from('student_admissions as sa')
            .innerJoin('students as s', 'sa.student_id', 's.id')
            .leftJoin('classes as cr', 'cr.id', 'sa.regular_class_id')
            .leftJoin('divisions as dr', 'dr.id', 'sa.regular_division_id')
            .leftJoin('classes as ce', 'ce.id', 'sa.elgastart_class_id')
            .leftJoin('divisions as de', 'de.id', 'sa.elgastart_division_id')
            .where('sa.school_id', req.query.school_id)
            .where('sa.status', 'active')
            //TODO: Add where for academic year
            .select(
            [
                's.id as _id',
                'sa.id as _admissionId',
                's.student_code as _studentCode',
                's.first_name as _sfirstname',
                's.middle_name as _smiddlename',
                's.last_name as _slastname',
                'cr.id as _class_id',
                'cr.name as _class_name',
                'dr.id as _division_id',
                'dr.name as _division_name',
                'ce.id as _elgaclass_id',
                'ce.name as _elgaclass_name',
                'de.id as _elgadivision_id',
                'de.name as _elgadivision_name'

            ]
            );

        if (req.query.student_name && req.query.student_name != "") {
            query.where('s.first_name', 'ilike', '%' + req.query.student_name + '%');
        }

        if (req.query.class_id && req.query.class_id != "") {
            query.where('sa.regular_class_id', req.query.class_id);
        }

        if (req.query.division_id && req.query.division_id != "") {
            query.where('sa.regular_division_id', req.query.division_id);
        }

        if (req.query.elga_class_id && req.query.elga_class_id != "") {
            query.where('sa.elgastart_class_id', req.query.elga_class_id);
        }

        if (req.query.elga_division_id && req.query.elga_division_id != "") {
            query.where('sa.elgastart_division_id', req.query.elga_division_id);
        }
        query.limit(pageSize).offset(pageSize * (page - 1));

        knexnest(query).then(function (results) {
            if (!results || results.length == 0) {
                res.status(200).send({ success: false, msg: 'No students found.' });
            } else {
                res.send({ success: true, students: results });
            }
        })
            .then(null, function (err) {
                res.status(500).send({ success: false, msg: err });
            });

    } catch (err) {
        res.status(500).send({ success: false, msg: 'An error occured. Please try again.', error: err });
    }
};

/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 24 Jan 2018,
 * @PARAMS: req, res, next
 */
exports.edit = async function (req, res, next) {
    try {

        req.assert('id', 'Student admission id cannot be blank').notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            return res.status(400).send(errors);
        }

        let sa = await StudentAdmissions.findOne({ id: req.params.id, status: 'active' });

        let division_id = req.body.division_id;
        let elga_division_id = req.body.elga_division_id;

        if (division_id && division_id != "") {
            sa.set('regular_division_id', division_id);
        }

        if (elga_division_id && elga_division_id != "") {
            sa.set('elgastart_division_id', elga_division_id);
        }

        let newSA = await sa.save(sa.changed, { patch: true });
        return res.status(200).send({ success: true, updatedStudentAdmission: newSA });

    } catch (err) {
        if (err.message == Constants.EmptyResponse) {
            res.status(500).send({ success: false, msg: 'Student does not exist.' });
        } else {
            res.status(500).send({ success: false, msg: 'An error occured. Please try again.', error: err });
        }
    }
};

