'use strict';

/**
 * post service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::post.post', ({ strapi }) => ({

  //  Method 1: Creating an entirely new custom service
  // async exampleService(...args) {
  //   console.log(args);

  //   let response = { okay: true }

  //   if (response.okay === false) {
  //     return { response, error: true }
  //   }

  //   return response
  // },

  // Method 2: Wrapping a core service (leaves core logic in place)
  // async find(...args) {  
  //   // Calling the default core controller
  //   const { results, pagination } = await super.find(...args);

  //   // some custom logic
  //   results.forEach(result => {
  //     result.counter = 1;
  //   });

  //   return { results, pagination };
  // },

  async findPublic(ctx) {
    // Calling the default core controller
      const newParams = {
        ...ctx,
          filters: {
            ...ctx.filters,
            isPremium: false
          }
        };
  
      const publicPosts = await strapi.entityService.findMany(
        'api::post.post', 
        this.getFetchParams(newParams)
      );

      return publicPosts;
    },

  // // Method 3: Replacing a core service
  async findOnePublic(ctx) {
    const id = ctx.params.id;
    const { params } = ctx.params;
    
    const publicPost = await strapi.entityService.findOne(
      'api::post.post', 
      id,
      this.getFetchParams(params)
    );
    return publicPost.isPremium ? null : publicPost;
  },

  // Add like from a User to a Post
  async likePost(postId, userId) { // ctx
    // console.dir(ctx);

    const params = {
      data: {
        likes: {
          connect: [userId]
        }
      }
    };

    const updatedPost = await strapi.entityService.update(
      'api::post.post', 
      postId,
      params
    );
    return updatedPost;
  }

}));
