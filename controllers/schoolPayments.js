var Schools = require('../models/school');
var PaymentDetails = require('../models/paymentDetails');
var fs = require('fs');
var wkhtmltopdf = require('wkhtmltopdf');


/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 *
 */
exports.updateSchoolPayment = function (req, res, next) {
  req.assert('payment_type_id', 'payment type cannot be blank').notEmpty();
  req.assert('amount', 'amount cannot be blank').notEmpty();
  req.assert('status_id', 'status cannot be blank').notEmpty();
  req.assert('due_date', 'status cannot be blank').notEmpty();
  req.assert('comment', 'comment cannot be blank').notEmpty();
  req.assert('pay_mode_id', 'mode cannot be blank').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  PaymentDetails.findOne({id: req.params.id}, {require: false})
    .then(function (school_payment_details) {
      if(!school_payment_details) {
        return res.status(200).send({success: false, msg: 'Payment details does not exist.'});
      } else {
        school_payment_details.set('payment_type_id', req.body.payment_type_id);
        school_payment_details.set('amount', req.body.amount);
        school_payment_details.set('status_id', req.body.status_id);
        school_payment_details.set('due_date', req.body.due_date);
        school_payment_details.set('comment', req.body.comment);
        school_payment_details.set('pay_mode_id', req.body.pay_mode_id);
        if(req.body.ref_no) {
          school_payment_details.set('ref_no', req.body.ref_no);
        }
        if(req.body.bank_name) {
          school_payment_details.set('bank_name', req.body.bank_name);
        }
        if(req.body.payment_date) {
          school_payment_details.set('payment_date', req.body.payment_date);
        }

        school_payment_details.save(school_payment_details.changed, {patch: true})
          .then(function (payment_details) {
            return res.status(200).send({success: true, payment_details: payment_details.toJSON()});
          });
      }
    });
};


/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 *
 */
exports.getPaymentDetails = function (req, res, next) {
  PaymentDetails.findOne({id: req.params.id}, {require: false})
    .then(function (payment_details) {
      if(!payment_details) {
        return res.status(200).send({success: false, msg: 'Payment details does not exist.'});
      } else {
        return res.status(200).send({success: true, payment_details: payment_details.toJSON()});
      }
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 *
 */
exports.downloadPaymentDetails = function (req, res, next) {
  PaymentDetails.findOne({id: req.params.id}, {require: false})
    .then(function (payment_details) {
      if(!payment_details) {
        return res.status(200).send({success: false, msg: 'Payment details does not exist.'});
      } else {
        var htmlContent = "<div class=\"container\">\n" +
          "    <div class=\"row\">\n" +
          "      <h2 style=\"text-align: right;\">INVOICE</h2>\n" +
          "      <div>\n" +
          "        <div style=\"text-align: left;\">[Street Address]</div>\n" +
          "        <div style=\"text-align: right;\">INVOICE # " + payment_details.attributes.invoices_no + "</div>\n" +
          "      </div>\n" +
          "      <div style=\"text-align: right;\">\n" +
          "        <span>Date : " + payment_details.attributes.invoice_date + "</span>\n" +
          "      </div>\n" +
          "      <div>\n" +
          "        <span style=\"text-align: left;\">To :</span>\n" +
          "        <span style=\"text-align: center;\">FOR :</span>\n" +
          "      </div>\n" +
          "      <div style=\"width: 100%\">\n" +
          "        <table style=\"width: 100%; border: 1px solid black; border-collapse: collapse;\">\n" +
          "          <tr style=\"border: 1px solid black; border-collapse: collapse;\">\n" +
          "            <th style=\"border: 1px solid black; border-collapse: collapse;\">DESCRIPTION</th>\n" +
          "            <th style=\"border: 1px solid black; border-collapse: collapse;\">PERIOD</th>\n" +
          "            <th style=\"border: 1px solid black; border-collapse: collapse;\">RATE</th>\n" +
          "            <th style=\"border: 1px solid black; border-collapse: collapse;\">AMOUNT (INR)</th>\n" +
          "          </tr>\n" +
          "          <tr style=\"border: 1px solid black; border-collapse: collapse;\">\n" +
          "            <td style=\"border: 1px solid black; border-collapse: collapse;\">" + payment_details.attributes.comment + "</td>\n" +
          "            <td style=\"border: 1px solid black; border-collapse: collapse;\"></td>\n" +
          "            <td style=\"border: 1px solid black; border-collapse: collapse;\"></td>\n" +
          "            <td style=\"border: 1px solid black; border-collapse: collapse;\">" + payment_details.attributes.amount + "</td>\n" +
          "          </tr>\n" +
          "          <tr>\n" +
          "            <td colspan=\"3\">Total</td>\n" +
          "            <td style=\"border: 1px solid black; border-collapse: collapse;\">" + payment_details.attributes.amount + "</td>\n" +
          "          </tr>\n" +
          "        </table>\n" +
          "      </div>\n" +
          "    </div>\n" +
          "  </div>";

        wkhtmltopdf(
          htmlContent, {
            output: 'invoice.pdf',
            pageSize: 'letter'
          },
          function (err, stream) {
            return res.download('invoice.pdf');
          });
      }
    });
};