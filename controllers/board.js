var Board = require('../models/boards');


/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns list of all boards
 */
exports.index = function (req, res, next) {
  Board.findAll()
    .then(function (items) {
      return res.status(200).send({success: true, board: items.toJSON()});
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * if board_name is blank respond error
 * add board_name into board table
 */
exports.create = function (req, res, next) {
  req.assert('name', 'Board name cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  var boardName = req.body.name;
  checkExist(boardName, '').then(function (exist) {
    if(exist) {
      return res.status(200).send({ success: false, msg: 'Board name already exist' });
    } else {
      Board.create({
        name: boardName
      })
        .then(function (board_details) {
          return res.status(200).send({ success: true, board: board_details.toJSON() });
        });
    }
  });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * if board_name and board id is blank respond error
 * check board
 *  if not exist
 *    respond error
 *  else
 *    update the board name
 */
exports.upsert = function (req, res, next) {
  req.assert('name', 'Board name cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  Board.findOne({ id: req.params.id }, { require: false })
    .then(function (board_details) {
      if (!board_details) {
        return res.status(400).send({ success: false, msg: 'Board id does not exist' });
      }
      var boardName = req.body.name;
      if(boardName.toLowerCase() === board_details.attributes.name.toLowerCase()) {
        board_details.set('name', boardName);
        board_details.save(board_details.changed, { patch: true }).then(function (newBoard) {
          return res.status(200).send({ success: true, board: newBoard.toJSON() });
        });
      } else {
        checkExist(boardName, req.params.id).then(function (exist) {
          if(exist) {
            return res.status(200).send({ success: false, msg: 'Board name already exist' });
          } else {
            board_details.set('name', boardName);
            board_details.save(board_details.changed, { patch: true }).then(function (newBoard) {
              return res.status(200).send({ success: true, board: newBoard.toJSON() });
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
 * check board
 *  if not exist
 *    respond error
 *  else
 *    delete board
 */
exports.destroy = function (req, res, next) {
  Board.findOne({id: req.params.id}, {require: false})
    .then(function (board_details) {
      if (!board_details) {
        return res.status(400).send({success: false, msg: 'Board id does not exist'});
      }

      Board.destroy({id: req.params.id})
        .then(function () {
          return res.status(200).send({success: true, msg: 'Board successfully deleted.'});
        })
        .catch(function () {
          return res.status(400).send({success: false, msg: 'Board not deleted.'});
        });

    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns list of all boards
 */
exports.show = function (req, res, next) {
  Board.findOne({id: req.params.id})
    .then(function (items) {
      if(!items) {
        return res.status(400).send({success: false, msg: 'Board does not exists.'});
      }
      return res.status(200).send({success: true, board: items.toJSON()});
    })
    .catch(function (err) {
      return res.status(400).send({success: false, msg: 'Board does not exists.'});
    });
};

function checkExist(boardName, id) {
  return new Promise(function (resolve, reject) {
    let exist = false;
    Board.findAll()
      .then(function (boards) {
        boards = boards.toJSON();
        var length = boards.length;
        var iterator = 0;
        boards.forEach(function (board) {
          iterator++;
          if(id && id.length > 0) {
            if(id !== board.id) {
              if(boardName.toLowerCase() === board.name.toLowerCase()) {
                exist = true;
              }
            }
          } else {
            if(boardName.toLowerCase() === board.name.toLowerCase()) {
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