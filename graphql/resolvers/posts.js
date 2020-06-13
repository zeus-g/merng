const Post = require("../../models/Post");
const checkAuth = require("../../utils/check-auth");
const { AuthenticationError } = require("apollo-server");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post tidak ditemukan");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    //creating post
    async createPost(_, { body }, context) {
      //check auth token di header
      const user = checkAuth(context);
      //create new post
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      //save to database
      const post = await newPost.save();

      //return to respond
      return post;
    },
    //deleting post
    async deletePost(_, { postId }, context) {
      //cek user token
      const user = checkAuth(context);
      //try and catch
      try {
        //mencari postingan dengan post id
        const post = await Post.findById(postId);
        //cek apakah uername sama
        if (user.username === post.username) {
          post.delete(); //delete post
          return "Post berhasil dihapus"; //return respone to client
        } else {
          throw new AuthenticationError("TIndakan tidak diperbolehkan");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
