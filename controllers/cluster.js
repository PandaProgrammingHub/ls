var Cluster = require('../models/clusters');


/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns list of all clusters
 */
exports.index = function (req, res, next) {
  Cluster.findAll()
    .then(function (items) {
      return res.status(200).send({success: true, cluster: items.toJSON()});
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * if name is blank respond error
 * add name into clusters table
 */
exports.create = function (req, res, next) {
  req.assert('name', 'Cluster name cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  var clusterName = req.body.name;
  checkExist(clusterName, '').then(function (exist) {
    if(exist) {
      return res.status(200).send({ success: false, msg: 'Cluster name already exist' });
    } else {
      Cluster.create({
        name: clusterName
      })
        .then(function (cluster_details) {
          return res.status(200).send({success: true, cluster: cluster_details.toJSON()});
        });
    }
  });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * if name and id is blank respond error
 * check cluster
 *  if not exist
 *    respond error
 *  else
 *    update the cluster name
 */
exports.upsert = function (req, res, next) {
  req.assert('name', 'Cluster name cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  Cluster.findOne({id: req.params.id}, {require: false})
    .then(function (cluster_details) {
      if (!cluster_details) {
        return res.status(400).send({success: false, msg: 'Cluster id does not exist'});
      }

      var clusterName = req.body.name;
      checkExist(clusterName, req.params.id).then(function (exist) {
        if(exist) {
          return res.status(200).send({ success: false, msg: 'Cluster name already exist' });
        } else {
          cluster_details.set('name', clusterName);
          cluster_details.save(cluster_details.changed, {patch: true}).then(function (newCluster) {
            return res.status(200).send({success: true, cluster: newCluster.toJSON()});
          });
        }
      });
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * check cluster
 *  if not exist
 *    respond error
 *  else
 *    delete cluster
 */
exports.destroy = function (req, res, next) {
  Cluster.findOne({id: req.params.id}, {require: false})
    .then(function (cluster_details) {
      if (!cluster_details) {
        return res.status(400).send({success: false, msg: 'Cluster id does not exist'});
      }

      Cluster.destroy({id: req.params.id})
        .then(function () {
          return res.status(200).send({success: true, msg: 'Cluster successfully deleted.'});
        })
        .catch(function () {
          return res.status(400).send({success: false, msg: 'Cluster not deleted.'});
        });

    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns list of all clusters
 */
exports.show = function (req, res, next) {
  Cluster.findOne({id: req.params.id})
    .then(function (item) {
      if(!item) {
        return res.status(400).send({success: false, msg: 'Cluster does not exist'});
      }
      return res.status(200).send({success: true, cluster: item.toJSON()});
    })
    .catch(function (err) {
      return res.status(400).send({success: false, msg: 'Cluster does not exist'});
    });
};

function checkExist(clusterName, id) {
  return new Promise(function (resolve, reject) {
    let exist = false;
    Cluster.findAll()
      .then(function (clusters) {
        clusters = clusters.toJSON();
        var length = clusters.length;
        var iterator = 0;
        clusters.forEach(function (cluster) {
          iterator++;
          if(id && id.length > 0) {
            if(id !== cluster.id) {
              if(clusterName.toLowerCase() === cluster.name.toLowerCase()) {
                exist = true;
              }
            }
          } else {
            if(clusterName.toLowerCase() === cluster.name.toLowerCase()) {
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