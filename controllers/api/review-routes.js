const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Movie, User, Reviews } = require('../../models');
const withAuth = require('../../util/auth');

// GET all reviews for a movie
router.get('/:id', (req, res) => {
    Reviews.findAll({
        where: {
            movie_id: req.params.id
        },
        attributes: [
            'id',
            'post',
            'stars',
            'user_id',
            'movie_id'
        ],
        include: [
            {
                model: User,
                attributes: ['id', 'username']
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
router.post('/', withAuth, (req, res) => {
    Reviews.create({
        post: req.body.post,
        stars: req.body.stars,
        movie_id: req.body.movie_id,
        user_id: req.body.user_id
    })
    .then(dbReviewData => res.json(dbReviewData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// UPDATE review
router.put('/:id', withAuth, (req, res) => {
    Reviews.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    .then(dbReviewData => {
        if (!dbReviewData[0]) {
            res.status(404).json({ message: 'No review found with this id' });
            return;
        }
        res.json(dbReviewData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

// DELETE review
router.delete('/:id', withAuth, (req, res) => {
    Reviews.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbReviewData => {
        if (!dbReviewData) {
            res.status(404).json({ message: 'No review found with this id' });
            return;
        }
        res.json(dbReviewData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;