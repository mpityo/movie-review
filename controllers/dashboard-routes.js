const router = require('express').Router();
const sequelize = require('../config/connection');
const { Reviews, User, Movie } = require('../models');
const withAuth = require('../util/auth');

// /dashboard routes

router.get('/', withAuth, (req, res) => {
    Reviews.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'post',
            'stars',
            'user_id',
            'movie_id',
            'created_at'
        ],
        include: [
            {
                model: User,
                attributes: ['id', 'username']
            }
        ]
    })
    .then(dbReviewData => {
        const reviews = dbReviewData.map(review => review.get({ plain: true }));
        let isAdmin;
        if (req.session.user_id === 1) {
            isAdmin = true;
        } else {
            isAdmin = false;
        }
        const user = {
            isAdmin,
            username: req.session.username
        };
        res.render('dashboard', { reviews, user, loggedIn: true });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// edit post by id
// router.get('/edit/:id', withAuth, (req, res) => {
//     Post.findOne({
//         where: {
//             id: req.params.id
//         },
//         attributes: [
//             'id',
//             'title',
//             'content',
//             'created_at'
//         ],
//         include: [
//             {
//                 model: Comment,
//                 attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
//                 include: {
//                     model: User,
//                     attributes: ['username']
//                 }
//             },
//             {
//                 model: User,
//                 attributes: ['username']
//             }
//         ]
//     })
//     .then(dbPostData => {
//         if (!dbPostData) {
//             res.status(404).json({ message: 'No post found with this id' });
//             return;
//         }
//         const post = dbPostData.get({ plain: true });
//         res.render('edit-post', { post, loggedIn: true });
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//     });
// });

module.exports = router;