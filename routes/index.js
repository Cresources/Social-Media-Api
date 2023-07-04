// express server to handle api endpoints
import Appcontroller from '../controllers/Appcontroller.js';
import AuthController from '../controllers/AuthController.js';
import UsersController from '../controllers/UsersController.js';
import PostController from '../controllers/PostController.js';
import CommentController from '../controllers/CommentController.js';
import LikeController from '../controllers/LikeController.js';
import express from 'express';
import { passport } from 'passport';
const app = express();

app.use(express.json());

app.get('/status', Appcontroller.status);

app.get('/signin', AuthController.getConnect);

app.post('/users', UsersController.postNew);

app.get('/disconnect', AuthController.getDisconnect);


// crud operations for creating a post

app.post('/newPost', PostController.newPost);

app.get('/posts', PostController.allPosts);

app.put('/editPost', PostController.editPost);

app.get('/getPost', PostController.getPost);

app.delete('/delPost', PostController.delPost);


// crud operations for creating a comment
                                               
app.post('/newComment', CommentController.newComment);

app.get('/comments', CommentController.allComments);

app.put('/editComment', CommentController.editComment);

app.get('/getComment', CommentController.getComment);   
   
app.delete('/delComment', CommentController.delComment);

// crud operations for liking a post
app.post('/like', LikeController.like);

app.delete('/unlike', LikeController.unlike);

export default app;
