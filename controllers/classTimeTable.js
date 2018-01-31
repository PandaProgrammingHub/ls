const fs = require('fs-extra');
const SchoolClasses = require('../models/schoolClasses');
const Schools = require('../models/school');
const Constants = require('../constants');
const config = require('../config');

/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 24 Jan 2018,
 * @PARAMS: req, res, next
 * Save uploaded file 
 * 
 */
exports.upload = async function (req, res, next) {
    req.assert('id', 'Class id cannot be blank').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }
    try {
        let c = await SchoolClasses.findOne({ id: req.params.id, is_enabled: true }, { require: false });
        if (!c) {
            return res.status(400).send({ success: false, msg: 'Class not found' });
        }

        let s = await Schools.findOne({ id: c.attributes.school_id }, {require: false});

        if (!s){
            return res.status(400).send({ success: false, msg: 'School not found' });
        }
        
        let tt = req.files.timetable;
        let dir = "/files/timetables/school-" + s.attributes.uid + "/";
        let filename = "tt-class-" + c.attributes.class_id + "-" + c.attributes.division_id + ".pdf";
        let filePath = config.PROJECT_DIR + dir + filename;
        await fs.ensureDir(config.PROJECT_DIR + dir);
        await fs.writeFile( filePath, tt.data);
        c.set("timetable", dir + filename);
        
        c = await c.save(c.changed, {patch: true});
        res.status(200).send({success: true, filePath: c.attributes.timetable});
    } catch (err) {
        res.status(500).send({ success: false, msg: 'An error occured. Please try again.', error: err });

    }
};


/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 30 Jan 2018,
 * @PARAMS: req, res, next
 * Download timetable 
 * 
 */
exports.download = async function (req, res, next) {
    req.assert('id', 'Class id cannot be blank').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }
    try {
        let c = await SchoolClasses.findOne({ id: req.params.id, is_enabled: true }, { require: false });
        if (!c) {
            return res.status(400).send({ success: false, msg: 'Class not found' });
        }
        const filepath = config.PROJECT_DIR + c.attributes.timetable;
        res.download(filepath);
    } catch (err) {
        res.status(500).send({ success: false, msg: 'An error occured. Please try again.', error: err });
    }
};
