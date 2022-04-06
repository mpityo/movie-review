const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Movie, User, Reviews } = require('../../models');

// GET all reviews for a movie
router.get('/:id', (req, res) => {
    Reviews.findAll({
        where: {
            movie_id: req.params.id
        },
        attributes: [
            'id',
            'post',
            'stars'
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Movie,
                attributes: ['db_id']
            }
        ]
    })
    .then(dbReviewData => {
        if (!dbReviewData) {
            res.status(404).json({ message: "No reviews found for this movie "});
            return;
        }
        res.json(dbReviewData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// CREATE review


module.exports = router;