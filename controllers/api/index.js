const router = require('express').Router();

const movieRoutes = require('./movie-routes');
const reviewRoutes = require('./review-routes');
const userRoutes = require('./user-routes');

router.use('/movies', movieRoutes);
router.use('/reviews', reviewRoutes);
router.use('/users', userRoutes);

module.exports = router;