// @ts-nocheck
// 'use strict';

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({ strapi }) =>  ({
  // Method 1: Creating an entirely custom action
  async exampleAction(ctx) {
    // await strapi.service('api::post.post').exampleService({ MyParam: 'example' });
    try {
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  },

  // Solution 1 : fetch all posts and filter them afterwards
  // async find(ctx) {
    
  //   // Check if user is logged in
  //   const isAuthenticated = ctx.state.user ? true : false;

  //   // some custom logic here
  //   // ctx.query = { ...ctx.query, publicationState: 'preview' }; // posts?publicationState=preview

  //   // Calling the default core action = fetching all posts
  //   let { data, meta } = await super.find(ctx);
  
  //   if (!isAuthenticated) {
  //     data = data.filter(
  //       (post) => post.attributes.isPremium == false
  //     );
  //   }

  //   return { data, meta };
  // },

  // Solution 2 : rewriter the action to fetch only needed posts
  // async find(ctx) { // 'posts/:id
  //   // Check if user is logged in
  //   const isRequestingNonPremium = ctx.query.filters && ctx.query.filters.isPremium["$eq"] == 'false';
  //   const isAuthenticated = ctx.state.user ? true : false;
    
  //   const { query } = ctx;
  //   let filter = null;
  //   if (!isAuthenticated || isRequestingNonPremium) {
  //     filter = { 
  //       ...query,
  //       filters: {
  //         ...query.filters,
  //         isPremium: false
  //       }
  //     }
  //   }

  //   const { results, pagination } = await strapi.service('api::post.post').find(filter);
  //   const sanitizedResults = await this.sanitizeOutput(results, ctx);
  //   return this.transformResponse(sanitizedResults, { pagination });
  // }

  async find(ctx) {
    // Check if user is logged in
    const isAuthenticated = ctx.state.user ? true : false;
    const isRequestingNonPremium = ctx.query.filters && ctx.query.filters.isPremium["$eq"] == 'false';

    if (isAuthenticated || isRequestingNonPremium) return await super.find(ctx);
    

    // If request is Public
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);
    const publicPosts = await strapi
      .service('api::post.post')
      .findPublic(sanitizedQueryParams);
    const sanitizedPosts = await this.sanitizeOutput(publicPosts, ctx);

    return this.transformResponse(sanitizedPosts);
  },

  async findOne(ctx) {
    // If user is Authenticated use standard findOne
    const isAuthenticated = ctx.state.user ? true : false;
    if (isAuthenticated) return await super.findOne(ctx);

    // Else if request is Public
    const publicPost = await strapi
      .service('api::post.post')
      .findOnePublic(ctx);

    const sanitizedPost = await this.sanitizeOutput(publicPost, ctx);
    return this.transformResponse(sanitizedPost);
  }, 

  // Add like to a Post
  async likePost(ctx) {

    const postId = ctx.params.id;
    const userId = ctx.state.user.id;

    try {
      const updatedPost = await strapi
        .service('api::post.post')
        .likePost(postId, userId);

      const sanitizedPost = await this.sanitizeOutput(updatedPost, ctx);
      return this.transformResponse(sanitizedPost);
    
    } catch (error) {
      console.error(error);
    }

  }
}));