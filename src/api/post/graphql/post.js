module.exports = {
  likePostMutation: `
          type Mutation {
              likePost(id: ID!): PostEntityResponse
          }
      `
  ,
  getLikePostResolver: (strapi) => {
    const toEntityResponse = strapi.plugin('graphql').service('format').returnTypes.toEntityResponse;
    
    const resolverFunction =  async (parent, args, ctx, info) => {
      // resolver implementation
      const postId = args.id;
      const userId = ctx.state.user.id;

      const likedPost = await strapi
        .service('api::post.post')
        .likePost(postId, userId);
      const formattedPost = toEntityResponse(likedPost, {
        args,
        resourceUID: 'api::post.post'
      })
      return formattedPost;
    };
    return resolverFunction;
  },

  likePostMutationConfig: {
    auth: {
      scope: ['api::post.post.likePost']
    }
  }

}