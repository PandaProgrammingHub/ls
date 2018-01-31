var Role = require('../models/roles');
var modelBase = require('../config/bookshelf');

var permissions = modelBase.extend({
  tableName: 'permissions',
  hasTimestamps: true
});

var rolePermissions = modelBase.extend({
  tableName: 'permissions_role',
  hasTimestamps: true
});

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns list of all roles
 */
exports.index = function (req, res, next) {
  Role.findAll()
    .then(function (items) {
      return res.status(200).send({success: true, roles: items.toJSON()});
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
  req.assert('role_name', 'role name cannot be blank').notEmpty();
  req.assert('role_type', 'role type cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  var roleName = req.body.role_name;
  checkExist(roleName, '').then(function (exist) {
    if(exist) {
      return res.status(200).send({ success: false, msg: 'Roles already exist' });
    } else {
      Role.create({
        role_name: roleName,
        role_type: req.body.role_type
      })
        .then(function (role_details) {
          if (req.body.permissions_ids && req.body.permissions_ids.length > 0) {
            var length = req.body.permissions_ids.length;
            var i = 0;
            req.body.permissions_ids.forEach(function (permissionId) {
              i++;
              addRolePermissions(permissionId, role_details.id);
              if (i === length) {
                return res.status(200).send({success: true, role: role_details.toJSON()});
              }
            });
          } else {
            return res.status(200).send({success: true, role: role_details.toJSON()});
          }
        });
    }
  });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * if name and id is blank respond error
 * check role
 *  if not exist
 *    respond error
 *  else
 *    update the role name and type
 */
exports.upsert = function (req, res, next) {
  if (req.body.role_name) {
    req.assert('role_name', 'Role name cannot be blank').notEmpty();
  }

  if (req.body.role_type) {
    req.assert('role_type', 'Role type cannot be blank').notEmpty();
  }

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  Role.findOne({id: req.params.id}, {require: false})
    .then(function (role_details) {
      if (!role_details) {
        return res.status(400).send({success: false, msg: 'Roles does not exist'});
      }
      var roleName = req.body.role_name;
      var roleType = req.body.role_type;
      if( (roleName.toLowerCase() !== role_details.attributes.role_name.toLowerCase())
      && (roleType.toLowerCase() !== role_details.attributes.role_type.toLowerCase()) ) {
      checkExist(roleName, req.params.id).then(function (exist) {
        if(exist) {
          return res.status(200).send({ success: false, msg: 'Role name already exist' });
        } else {
          checkTypeExist(roleType, req.params.id).then(function (exist) {
            if(exist) {
              return res.status(200).send({ success: false, msg: 'Role type already exist' });
            } else {
              updateRole(req, res, role_details);
            }
          });
        }
      });
    } else if( roleName.toLowerCase() !== role_details.attributes.role_name.toLowerCase() ) {
      checkExist(roleName, req.params.id).then(function (exist) {
        if(exist) {
          return res.status(200).send({ success: false, msg: 'Role name already exist' });
        } else {
          updateRole(req, res, role_details);
        }
      });
    } else if( roleType.toLowerCase() !== role_details.attributes.role_type.toLowerCase() ) {
      checkTypeExist(roleType, req.params.id).then(function (exist) {
        if(exist) {
          return res.status(200).send({ success: false, msg: 'Role type already exist' });
        } else {
          updateRole(req, res, role_details);
        }
      });
    } else {
      updateRole(req, res, role_details);
    }
      // checkExist(roleName, req.params.id).then(function (exist) {
      //   if(exist) {
      //     return res.status(200).send({ success: false, msg: 'Role Name already exist' });
      //   } else {
      //     if (req.body.role_name) {
      //       role_details.set('role_name', roleName);
      //     }
      //     if (req.body.role_type) {
      //       role_details.set('role_type', req.body.type);
      //     }
      //     role_details.save(role_details.changed, {patch: true}).then(function (newRole) {
      //       if (req.body.permissions_ids && req.body.permissions_ids.length > 0) {
      //         var length = req.body.permissions_ids.length;
      //         var i = 0;
      //         req.body.permissions_ids.forEach(function (permissionId) {
      //           i++;
      //           addRolePermissions(permissionId, newRole.id);
      //           if (i === length) {
      //             return res.status(200).send({success: true, role: newRole.toJSON()});
      //           }
      //         });
      //       } else {
      //         return res.status(200).send({success: true, role: newRole.toJSON()});
      //       }
      //     });
      //   }
      // });
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
 *    delete role
 */
exports.destroy = function (req, res, next) {
  Role.findOne({id: req.params.id}, {require: false})
    .then(function (role_details) {
      if (!role_details) {
        return res.status(400).send({success: false, msg: 'Roles does not exist'});
      }
      getRolePermissions(req.params.id)
        .then(function (rolePermissions) {
          if(rolePermissions.length > 0) {
            removeRolePermissions(rolePermissions, req.params.id, res);
          } else {
            removeRole(req.params.id, res);
          }
        });
    });
};

function addRolePermissions(permissionId, roleId) {
  permissions.findOne({id: permissionId}, {require: false})
    .then(function (permissions_details) {
      if (permissions_details) {
        rolePermissions.findOne({role_id: roleId, permission_id: permissionId}, {require: false})
          .then(function (role_permission_config) {
            if (!role_permission_config) {
              rolePermissions.create({
                role_id: roleId,
                permission_id: permissionId
              })
                .then(function (config) {
                  return config;
                });
            }
          });
      }
    });
}

function getRolePermissions(roleId) {
  return new Promise(function(resolve, reject) {
    resolve(rolePermissions.findAll({role_id: roleId}));
  });
}

function removeRolePermissions(rolePermissionsArray, roleId, res) {
  var iterator = 0;
  rolePermissionsArray.forEach(function (item) {
    iterator++;
    rolePermissions.destroy({id: item.attributes.id});
    if(iterator === rolePermissionsArray.length) {
      removeRole(roleId, res);
    }
  });
}

function removeRole(roleId, res) {
  Role.destroy({id: roleId})
    .then(function () {
      return res.status(200).send({success: true, msg: 'Role successfully deleted.'});
    })
    .catch(function () {
      return res.status(400).send({success: false, msg: 'Role not deleted.'});
    });
}

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns role details
 */
exports.show = function (req, res, next) {
  Role.findOne({id: req.params.id})
    .then(function (item) {
      if(!item) {
        return res.status(400).send({success: false, msg: 'Role does not exist'});
      }
      return res.status(200).send({success: true, role: item.toJSON()});
    })
    .catch(function (err) {
      return res.status(400).send({success: false, msg: 'Role does not exist'});
    });
};

function checkExist(roleName, id) {
  return new Promise(function (resolve, reject) {
    let exist = false;
    Role.findAll()
      .then(function (roles) {
        roles = roles.toJSON();
        var length = roles.length;
        var iterator = 0;
        roles.forEach(function (role) {
          iterator++;
          if(id && id.length > 0) {
            if(id !== role.id) {
              if(roleName.toLowerCase() === role.role_name.toLowerCase()) {
                exist = true;
              }
            }
          } else {
            if(roleName.toLowerCase() === role.role_name.toLowerCase()) {
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

function checkTypeExist(roleType, id) {
  return new Promise(function (resolve, reject) {
    let exist = false;
    Role.findAll()
    .then(function (roles) {
      roles = roles.toJSON();
      var length = roles.length;
      var iterator = 0;
      roles.forEach(function (role) {
        iterator++;
        if(id && id.length > 0) {
          if(id !== role.id) {
            if(roleType.toLowerCase() === role.role_type.toLowerCase()) {
              exist = true;
            }
          }
        } else {
          if(roleType.toLowerCase() === role.role_type.toLowerCase()) {
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

function updateRole(req, res, role_details) {
  if (req.body.role_name) {
    role_details.set('role_name', req.body.role_name);
  }
   if (req.body.role_type) {
    role_details.set('role_type', req.body.role_type);
  }

  role_details.save(role_details.changed, {patch: true})
    .then(function (newClass) {
        return res.status(200).send({success: true, class: newClass.toJSON()});
    });
}