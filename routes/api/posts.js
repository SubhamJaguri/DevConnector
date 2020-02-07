const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middlewares/auth');
const Post = require('../../models/post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route       POST api/posts
// @desc        create a Post
// @access      Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route       GET api/posts
// @desc        Get all Posts
// @access      Private

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route       GET api/posts/:id
// @desc        Get Post by Id
// @access      Private

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Post not found' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route       DELETE api/posts/:id
// @desc        Delete Post by Id
// @access      Private

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: 'Post not found' });
    }

    //check user

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post Removed' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Post not found' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route       PUT api/posts/like/:id
// @desc        Like a post
// @access      Private

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: 'Post not found' });
    }

    //check if the post has already been liked 
    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
        
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post Removed' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Post not found' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route       PUT api/posts/comment/:id
// @desc        comment on a post
// @access      Private

router.put('/comment/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: 'Post not found' });
    }

    //check user

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post Removed' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Post not found' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
