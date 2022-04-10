const router = require('express').Router();

const movieRoutes = require('./movie-routes');
const reviewRoutes = require('./review-routes');
const userRoutes = require('./user-routes');
const searchRoutes = require('./search-routes');

router.use('/movies', movieRoutes);
router.use('/reviews', reviewRoutes);
router.use('/users', userRoutes);
router.use('/search', searchRoutes);

module.exports = router;