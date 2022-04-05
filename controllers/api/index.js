const router = require('express').Router();

const movieRoutes = require('./movie-routes');
const reviewRoutes = require('./review-routes');

router.use('/movies', movieRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;