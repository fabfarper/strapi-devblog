'use strict';

const like = require('./api/post/routes/like');
const { likePostMutation, getLikePostResolver, likePostMutationConfig } = require('./api/post/graphql/post');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    // Disable the 'find' operation on the 'restaurant' content-type in the 'post' API
    const extensionService =  strapi.plugin('graphql').service('extension');

    const extension = ({ nexus }) => ({
      // GraphQL SDL
      typeDefs: likePostMutation,
      resolvers: {
        Mutation: {
          likePost: getLikePostResolver(strapi)
        }
      },
      resolversConfig: {
        // Explicitely authorize GraphQL permissions on this method for authenticated users
        'Mutation.likePost': likePostMutationConfig,
      },
    });
    extensionService.use(extension);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    // listen to lifecycle events
    strapi.db.lifecycles.subscribe({
      models: ['admin::user'], // only listen to events for this model
      afterCreate: async ({ result }) => {
        // create an Author instance from the fields of the Admin User that has just been created
        // Extract the fields from the newly created Admin User
        const { 
          id, 
          firstname, 
          lastname, 
          email, 
          username, 
          createdAt, 
          updatedAt 
        } = result;
        
        const author = await strapi.service('api::author.author').create({
          data: {
            firstname: firstname, 
            lastname: lastname, 
            email: email, 
            username: username,
            createdAt: createdAt,
            updatedAt: updatedAt,
            admin_user: [id] 
          }
        });
      }, 
      afterUpdate: async ({ result }) => {
        // Extract the fields from the newly updated Admin User
        const { 
          id, 
          firstname, 
          lastname, 
          email, 
          username, 
          updatedAt 
        } = result;
        // console.log(result);

        // get the Author that corresponds to the Admin User that's been updated
        const authorToUpdate = (await strapi.entityService.findMany('api::author.author', {
          populate: '*',
          filters: { 
            admin_user: {
              id: id
            }
          }
        }))[0];
        console.log(authorToUpdate);

        // update Author
        if (authorToUpdate) {
          const updatedAuthor = await strapi.service('api::author.author').update(authorToUpdate.id, {
            data: {
              firstname: firstname,
              lastname: lastname,
              email: email,
              username: username,
              updatedAt: updatedAt
            }
          });
        }
      }
    })
  },
};
