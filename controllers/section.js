var Section = require('../models/sections');


/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns list of all sections
 */
exports.index = function (req, res, next) {
  Section.findAll()
    .then(function (items) {
      return res.status(200).send({success: true, sections: items.toJSON()});
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * if name is blank respond error
 * add name into sections table
 */
exports.create = function (req, res, next) {
  req.assert('name', 'Section name cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  var sectionName = req.body.name;
  checkExist(sectionName, '').then(function (exist) {
    if(exist) {
      return res.status(200).send({ success: false, msg: 'Section already exist' });
    } else {
      Section.create({
        section_name: sectionName
      })
        .then(function (section_details) {
          return res.status(200).send({success: true, section: section_details.toJSON()});
        });
    }
  });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * if name and id is blank respond error
 * check sections
 *  if not exist
 *    respond error
 *  else
 *    update the section name
 */
exports.upsert = function (req, res, next) {
  req.assert('name', 'Section name cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  Section.findOne({ id: req.params.id }, { require: false })
  .then(function (section_details) {
    if (!section_details) {
      return res.status(400).send({ success: false, msg: 'Section id does not exist' });
    }

    var sectionName = req.body.name;
    if(sectionName.toLowerCase() === section_details.attributes.section_name.toLowerCase()) {
      section_details.set('section_name', sectionName);
      section_details.save(section_details.changed, {patch: true}).then(function (newSection) {
        return res.status(200).send({success: true, section: newSection.toJSON()});
      });
    } else {
      checkExist(sectionName, req.params.id).then(function (exist) {
        if(exist) {
          return res.status(200).send({ success: false, msg: 'Section already exist' });
        } else {
          section_details.set('section_name', sectionName);
          section_details.save(section_details.changed, {patch: true}).then(function (newSection) {
            return res.status(200).send({success: true, section: newSection.toJSON()});
          });
        }
      });
    }
  });
};




/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * check component
 *  if not exist
 *    respond error
 *  else
 *    delete section
 */
exports.destroy = function (req, res, next) {
  Section.findOne({id: req.params.id}, {require: false})
    .then(function (section_details) {
      if (!section_details) {
        return res.status(400).send({success: false, msg: 'section id does not exist'});
      }

      Section.destroy({id: req.params.id})
        .then(function () {
          return res.status(200).send({success: true, msg: 'section successfully deleted.'});
        })
        .catch(function () {
          return res.status(400).send({success: false, msg: 'section not deleted.'});
        });

    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns section details provided by ID
 */
exports.show = function (req, res, next) {
  Section.findOne({id: req.params.id})
    .then(function (item) {
      if(!item) {
        return res.status(400).send({success: false, msg: 'Section does not exist'});
      }
      return res.status(200).send({success: true, section: item.toJSON()});
    })
    .catch(function (err) {
      return res.status(400).send({success: false, msg: 'Section does not exist'});
    });
};

function checkExist(sectionName, id) {
  return new Promise(function (resolve, reject) {
    let exist = false;
    Section.findAll()
      .then(function (sections) {
        sections = sections.toJSON();
        var length = sections.length;
        var iterator = 0;
        sections.forEach(function (section) {
          iterator++;
          if(id && id.length > 0) {
            if(id !== section.id) {
              if(sectionName.toLowerCase() === section.section_name.toLowerCase()) {
                exist = true;
              }
            }
          } else {
            if(sectionName.toLowerCase() === section.section_name.toLowerCase()) {
              exist = true;
            }
          }
        });
        if(iterator === length) {
          resolve(exist);
        }
      });
  });
}