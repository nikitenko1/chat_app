const router = require('express').Router();
const userCtrl = require('./../controllers/userCtrl');
const { isAuthenticated } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router.route('/id/:id').get(isAuthenticated, userCtrl.searchUser);
router.route('/add/:id').patch(isAuthenticated, userCtrl.addFriend);
router.route('/search').get(isAuthenticated, userCtrl.searchFriend);

module.exports = router;
