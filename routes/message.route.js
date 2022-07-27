const router = require('express').Router();
const messageCtrl = require('../controllers/messageCtrl.js');
const { isAuthenticated } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router.route('/').post(isAuthenticated, messageCtrl.createMessage);
router.route('/conversation').get(isAuthenticated, messageCtrl.getConversation);

router.route('/:id').get(isAuthenticated, messageCtrl.getMessage);
router
  .route('/update/:id')
  .patch(isAuthenticated, messageCtrl.udpateReadStatus);

module.exports = router;
