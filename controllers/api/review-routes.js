const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Movie, User, Reviews } = require('../models/Movie');

// GET all reviews for a movie
router.get('/:id', (req, res) => {
    Reviews.findAll({
        where: {
            movie_id: req.params.id
        },
        attributes: [
            'id',
            'user_review_content',
            'user_review_stars'
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Movie,
                attributes: []
            }
        ]
    })
})

module.exports = router;