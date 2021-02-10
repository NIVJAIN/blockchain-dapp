
// const { body } = require('express-validator/check')
// router.post('/changeinconfig', validateController.validate('CHANGE_IN_CONFIG') ,routeController.CHANGE_IN_CONFIG)
// router.post('/setfloatingpins', validateController.validate('ASSIGN_FLOATING_PINS'), routeController.ASSIGN_FLOATING_PINS)
const {body, query, param,check } = require("express-validator")
exports.validate = (method) => {
  switch (method) {
    case 'ASSIGN_FLOATING_PINS': {
      var existMessage = "Must exist"
     return [ 
        body('pin', 'pin doesnt exists').exists().notEmpty(),
        body('orgid').exists().isUppercase().notEmpty(),
        body('mobile').exists().isInt().notEmpty(),
        body('loastart').exists().isString().notEmpty(),
        body('loaend').exists().isString().notEmpty(),
        body('maxdist').exists().isInt().notEmpty(),
        body('mindist').exists().isInt().notEmpty(),
        body('maxalt',"must be a number").exists().isInt().notEmpty(),
        body('minalt').exists().isInt().notEmpty(),
        body('maxvltn').exists().isInt().notEmpty(),
        body('updfreq',"must be a number").exists().isInt().notEmpty(),
        // body('mobile').exists().isInt(),
        // body('status').optional().isIn(['enabled', 'disabled'])
       ]   
    }
    case 'BULK_ASSIGN_FOR_FLOATINGPINS_AND_BROADCAST_SMS' :{
      return [
        // Whole ArrayCheck
        // body('arrayofpins').exists().withMessage('missing'),
        // Pin Id
        body('arrayofpins.*.pin').exists().withMessage("must exist")
        .isAlphanumeric().withMessage("Must be alpha numeric")
        .isUppercase().withMessage("Must be uppercase")
        .notEmpty().withMessage("must not be empty"),
          //Organization Id
          body('arrayofpins.*.orgid', "Must be caps lock and alphanumeric and it shouldnot exmpty").exists().isAlphanumeric().isUppercase().notEmpty(),
        // Mobile
          body('arrayofpins.*.mobile', 'must be a number').exists().isInt().notEmpty(),
          body('arrayofpins.*.loastart').exists().isString().notEmpty(),
          body('arrayofpins.*.loaend').exists().isString().notEmpty(),
          body('arrayofpins.*.maxdist').exists().isInt().notEmpty(),
          body('arrayofpins.*.mindist').exists().isInt().notEmpty(),
          body('arrayofpins.*.maxalt',"must be a number").exists().isInt().notEmpty(),
          body('arrayofpins.*.minalt').exists().isInt().notEmpty(),
          body('arrayofpins.*.maxvltn').exists().isInt().notEmpty(),
          body('arrayofpins.*.updfreq',"must be a number").exists().isInt().notEmpty(),
        // body('arrayofpins.*.').exists().isIn([1, 2, 3]),
      ];
    }
    case 'GENERATE_PINS_MAX20_ORGID':{
        console.log("JJJj")
        return [ 
            param('orgid','MustBeUpperCaseAndNotEmpty').exists().withMessage('orgid FieldCannotBeEmpty')
            .isUppercase().withMessage('MustBeUpperCase')
            .notEmpty(),

            param('quantity').isInt().withMessage('Must be only Numeric max to 20')
            .exists().notEmpty(),
           ]
    }
    case 'LOGIN' :{
        return [ 
            body('pin', 'pin doesnt exists').exists().isUppercase().notEmpty(),
            body('mobile').exists().isInt().notEmpty(),
            body('loastart').exists().isString().notEmpty(),
            body('loaend').exists().isString().notEmpty(),
           ]
    }
    case 'SET_APP_URLS' :{
      return [ 
          body('osurl', 'http url for IOS App download').exists().notEmpty(),
          body('androidurl', 'http url for Android App download').exists().notEmpty(),
          // body('loastart').exists().isString().notEmpty(),
          // body('loaend').exists().isString().notEmpty(),
         ]
  }
  case 'BATCH_SMS_PIN' :{
    return [
      body('arrayofpins.*').exists().withMessage("must exist").isAlphanumeric().withMessage("Must be alpha numeric")
      .isUppercase().withMessage("Must be uppercase")
      .notEmpty().withMessage("must not be empty"),
    ];
  }
		   case 'CHANGE_IN_CONFIG' :{
        return [
          body('fieldname', 'shouldhave a validfield name').exists().notEmpty(),
          body('fieldvalue', 'http url for A').exists().notEmpty(),
        ]
      }
  }
}
