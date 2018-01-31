var config = require('../knexfile');
var knex = require('knex')(config);
var knexnest = require('knexnest');
var Classes = require('../models/classes');
var Division = require('../models/divisions');
var StudentAdmissions = require('../models/studentAdmissions');
var modelUtils = require('../utils/modelUtils');

/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 16 Jan 2018,
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
            .leftJoin('classes as ce', 'ce.id', 'sa.elgaend_class_id')
            .leftJoin('divisions as de', 'de.id', 'sa.elgaend_division_id')
            .where('sa.school_id', req.query.school_id)
            .where('sa.status', 'active')
            //TODO: only show studdents who are not promoted, detained or terminated
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
        // query.limit(pageSize).offset(pageSize * (page - 1));

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
 * @Dated: 17 Jan 2018,
 * @PARAMS: req, res, next
 */
exports.edit = async function (req, res, next) {
    try {

        let data = req.body;
        let results = [];
        if (data == null || data.length == 0) {
            return res.status(400).send({ success: false });
        }

        for (let i = 0; i < data.length; i++) {
            let sp = data[i];
            try {

                let error = validateStudentPromotion(sp);

                if (error == null) {

                    let result = {};
                    await processStudentPromotion(sp);
                    result = {
                        success: true,
                        id: sp.student_admission_id
                    };
                    results.push(result);

                } else {
                    results.push(error);
                }
            } catch (err) {
                results.push({
                    id: sp.student_admission_id,
                    success: false,
                    errors: [err]
                });
                throw err; pboy
            }
        }

        return res.status(200).send(results);

    } catch (err) {
        res.status(500).send({ success: false, msg: 'An error occured. Please try again.', error: err });
        throw err;
    }
};


async function processStudentPromotion(sp) {

    try {
        let action = sp.action;

        let sa = await StudentAdmissions.findOne({ id: sp.student_admission_id, status: 'active' });

        if (action == "terminate") {
            sa.set('status', 'terminated');
            sa.save(sa.changed, { patch: true });
            return true;
        } else {

            let elga_action = sp.elga_action;
            var newSA = Object.assign(sa.attributes);
            delete newSA.id;

            //Update regular class
            if (action == "promote") {
                newSA.regular_class_id = await getNextClassId(sa.attributes.regular_class_id);
            } else if (action == "detain") {

            }

            //Update regular division
            newSA.regular_division_id = sp.new_regular_division_id;

            //Update Elga class
            if (sa.attributes.elgaboy_class_id != null) {
                newSA.elgastart_class_id = sa.attributes.elgaboy_class_id;
            } else if (elga_action == 'promote') {
                let classSeq = await getElgaClassSeqFromId(sa.attributes.elgastart_class_id);
                let newClassSeq = classSeq + 4;
                let newClassId = await getElgaClassIdFromSeq(newClassSeq);
                newSA.elgastart_class_id = newClassId;
            } else if (elga_action == 'detain') {
                let classSeq = await getElgaClassSeqFromId(sa.attributes.elgastart_class_id);
                let newClassSeq = classSeq + 3;
                let newClassId = await getElgaClassIdFromSeq(newClassSeq);
                newSA.elgastart_class_id = newClassId;
            }

            //Update Elga division
            newSA.elgastart_division_id = sp.new_elga_division_id;

            //Save new record
            newSA.academic_year_id += 1;
            StudentAdmissions.create(newSA);

            //Save old record
            sa.set('status', 'completed');
            sa.save(sa.changed, { patch: true });

            return true;
        }
    } catch (err) {
        throw err;
    }
}

function validateStudentPromotion(sp) {
    let error = null;
    if (sp.student_admission_id == null || sp.student_admission_id == "") {
        error = {
            success: false,
            param: 'student_admission_id',
            msg: 'Student Admission Id cannot be blank'
        };
    } else {
        error = {
            id: sp.student_admission_id,
            success: false
        };

        var errors = [];
        errors = validateKey(errors, sp, 'action');


        if (sp.action && sp.action != "" && sp.action != 'promote' && sp.action != 'detain' && sp.action != 'terminate') {
            errors.push({
                param: 'action',
                msg: 'Action is invalid'
            });
        }

        if (sp.action == 'terminate') {

        } else {
            //Action = Promote | Detain
            errors = validateKey(errors, sp, 'elga_action', 'Elga action cannot be blank');

            errors = validateKey(errors, sp, 'new_regular_division_id', "Division id cannot be blank");

            errors = validateKey(errors, sp, 'new_elga_division_id', "Elga division id cannot be blank");

        }

        if (errors.length > 0) {
            error.errors = errors;
        } else {
            error = null;
        }

    }
    return error;

}


async function getNextClassId(id) {
    let cls = await Classes.findOne({ id: id });
    let newCls = await Classes.findOne({ class_type: cls.attributes.class_type, class_sequence: cls.attributes.class_sequence + 1 });
    return newCls.attributes.id;
}

async function getElgaClassSeqFromId(id) {
    let cls = await Classes.findOne({ id: id });
    return cls.attributes.class_sequence;
}
async function getElgaClassIdFromSeq(seq) {
    let cls = await Classes.findOne({ class_type: 'elga', class_sequence: seq });
    return cls.attributes.id;
}

function validateKey(errors, obj, key, msg) {
    if (obj[key] == null || obj[key] == "") {
        let error = {};
        error.param = key;
        if (msg)
            error.msg = msg;
        else
            error.msg = key + ' cannot be blank'
        errors.push(error);
    }
    return errors;
}