var Component = require('../models/components');


/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns list of all components
 */
exports.index = function (req, res, next) {
  Component.findAll()
    .then(function (items) {
      return res.status(200).send({success: true, component: items.toJSON()});
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * if name is blank respond error
 * add name into components table
 */
exports.create = function (req, res, next) {
  req.assert('name', 'Component name cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  var componentName = req.body.name;
  checkExist(componentName, '').then(function (exist) {
    if(exist) {
      return res.status(200).send({ success: false, msg: 'Component name already exist' });
    } else {
      Component.create({
        component_name: componentName
      })
        .then(function (component_details) {
          return res.status(200).send({success: true, component: component_details.toJSON()});
        });
    }
  });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * if name and id is blank respond error
 * check components
 *  if not exist
 *    respond error
 *  else
 *    update the component name
 */
exports.upsert = function (req, res, next) {
  req.assert('name', 'Component name cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  Component.findOne({id: req.params.id}, {require: false})
    .then(function (component_details) {
      if (!component_details) {
        return res.status(400).send({success: false, msg: 'Component name already exist'});
      }

      var componentName = req.body.name;
      if(componentName.toLowerCase() === component_details.attributes.component_name.toLowerCase()) {
        component_details.set('component_name', componentName);
        component_details.save(component_details.changed, {patch: true}).then(function (newComponent) {
          return res.status(200).send({success: true, cluster: newComponent.toJSON()});
        });
      } else {
        checkExist(componentName, req.params.id).then(function (exist) {
          if(exist) {
            return res.status(200).send({ success: false, msg: 'Component already exist' });
          } else {
            component_details.set('component_name', componentName);
            component_details.save(component_details.changed, {patch: true}).then(function (newComponent) {
              return res.status(200).send({success: true, cluster: newComponent.toJSON()});
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
 *    delete component
 */
exports.destroy = function (req, res, next) {
  Component.findOne({id: req.params.id}, {require: false})
    .then(function (component_details) {
      if (!component_details) {
        return res.status(400).send({success: false, msg: 'component id does not exist'});
      }

      Component.destroy({id: req.params.id})
        .then(function () {
          return res.status(200).send({success: true, msg: 'component successfully deleted.'});
        })
        .catch(function () {
          return res.status(400).send({success: false, msg: 'component not deleted.'});
        });

    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns component details
 */
exports.show = function (req, res, next) {
  Component.findOne({id: req.params.id})
    .then(function (item) {
      if(!item) {
        return res.status(400).send({success: false, msg: 'Component does not exist'});
      }
      return res.status(200).send({success: true, component: item.toJSON()});
    })
    .catch(function (err) {
      return res.status(400).send({success: false, msg: 'Component does not exist'});
    });
};

function checkExist(componentName, id) {
  return new Promise(function (resolve, reject) {
    let exist = false;
    Component.findAll()
      .then(function (components) {
        components = components.toJSON();
        var length = components.length;
        var iterator = 0;
        components.forEach(function (component) {
          iterator++;
          if(id && id.length > 0) {
            if(id !== component.id) {
              if(componentName.toLowerCase() === component.component_name.toLowerCase()) {
                exist = true;
              }
            }
          } else {
            if(componentName.toLowerCase() === component.component_name.toLowerCase()) {
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