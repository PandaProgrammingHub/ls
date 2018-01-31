var ResourceType = require('../models/resourceType');

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns list of all resource type
 */
exports.index = function (req, res, next) {
  ResourceType.findAll()
    .then(function (items) {
      return res.status(200).send({success: true, resourceType: items.toJSON()});
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * if name and type is blank respond error
 * add name and type into roles table
 */
exports.create = function (req, res, next) {
  req.assert('title', 'resource type title cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  var resourceTypeName = req.body.title;
  checkExist(resourceTypeName, '').then(function (exist) {
    if(exist) {
      return res.status(200).send({ success: false, msg: 'resources type already exist.' });
    } else {
      ResourceType.create({
        title: resourceTypeName
      })
        .then(function (resource_type_details) {
          return res.status(200).send({success: true, resourceType: resource_type_details.toJSON()});
        });
    }
  });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * if name and id is blank respond error
 * check resource type
 *  if not exist
 *    respond error
 *  else
 *    update the resource type name
 */
exports.upsert = function (req, res, next) {
  req.assert('title', 'ResourceType title cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  ResourceType.findOne({id: req.params.id}, {require: false})
    .then(function (resource_type_details) {
      if (!resource_type_details) {
        return res.status(400).send({success: false, msg: 'Resource Type does not exist'});
      }

      var resourceTypeName = req.body.title;
      if(resourceTypeName.toLowerCase() === resource_type_details.attributes.title.toLowerCase()) {
        resource_type_details.set('title', resourceTypeName);
        resource_type_details.save(resource_type_details.changed, {patch: true}).then(function (newResourceType) {
          return res.status(200).send({success: true, role: newResourceType.toJSON()});
        });
      } else {
        checkExist(resourceTypeName, req.params.id).then(function (exist) {
          if(exist) {
            return res.status(200).send({ success: false, msg: 'Resource Type already exist' });
          } else {
            resource_type_details.set('title', resourceTypeName);
            resource_type_details.save(resource_type_details.changed, {patch: true}).then(function (newResourceType) {
              return res.status(200).send({success: true, role: newResourceType.toJSON()});
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
 *    delete ResourceType
 */
exports.destroy = function (req, res, next) {
  ResourceType.findOne({id: req.params.id}, {require: false})
    .then(function (resource_type_details) {
      if (!resource_type_details) {
        return res.status(400).send({success: false, msg: 'ResourceType id does not exist'});
      }

      ResourceType.destroy({id: req.params.id})
        .then(function () {
          return res.status(200).send({success: true, msg: 'ResourceType successfully deleted.'});
        })
        .catch(function () {
          return res.status(400).send({success: false, msg: 'ResourceType not deleted.'});
        });
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns resource type details
 */
exports.show = function (req, res, next) {
  ResourceType.findOne({id: req.params.id})
    .then(function (item) {
      if(!item) {
        return res.status(400).send({success: false, msg: 'Resource Type does not exist'});
      }
      return res.status(200).send({success: true, resourceType: item.toJSON()});
    })
    .catch(function (err) {
      return res.status(400).send({success: false, msg: 'Resource Type does not exist'});
    });
};

function checkExist(resourceTypeName, id) {
  return new Promise(function (resolve, reject) {
    let exist = false;
    ResourceType.findAll()
      .then(function (resourceTypes) {
        resourceTypes = resourceTypes.toJSON();
        var length = resourceTypes.length;
        var iterator = 0;
        resourceTypes.forEach(function (resourceType) {
          iterator++;
          if(id && id.length > 0) {
            if(id !== resourceType.id) {
              if(resourceTypeName.toLowerCase() === resourceType.title.toLowerCase()) {
                exist = true;
              }
            }
          } else {
            if(resourceTypeName.toLowerCase() === resourceType.title.toLowerCase()) {
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