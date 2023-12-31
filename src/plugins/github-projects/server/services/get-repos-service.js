'use strict';

const { request } = require('@octokit/request');
const axios = require("axios");
const md = require('markdown-it')();

module.exports = ({ strapi }) => ({

  getProjectForRepo: async (repo) => {
    const { id } = repo;
    const matchingProjects = await strapi.entityService.findMany('plugin::github-projects.project', {
      filters: {
        repositoryId: id
      }
    });
    if (matchingProjects.length) return matchingProjects[0].id;
    return null;
  },

  getPublicRepos: async () => {
    // return 'Welcome to Strapi 🚀';
    // GET /user/repos
    const result = await request("GET /orgs/artcoded-net/repos", {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
      type: "public",
    });
    // id, name, shortDescription, url, longDescription
    // https://raw.githubusercontent.com/artcoded-net/strapi-devblog/main/README.md
    
    return Promise.all(
      result.data.map(async (item) => {
        const { id, name, description, html_url, owner, default_branch } = item;
        const readmeUrl = `https://raw.githubusercontent.com/${owner.login}/${name}/${default_branch}/README.md`;
        // @ts-ignore
        const longDescription = md.render((await axios.get(readmeUrl)).data).replaceAll("\n", "<br>");
      
        const repo = { 
          id, name, shortDescription: description, url: html_url, longDescription
        };

        // Add some logic to search for an existing project for the current repo
        const relatedProjectId = await strapi
          .plugin('github-projects')
          .service('getReposService')
          .getProjectForRepo(repo);
        return {
          ...repo,
          projectId: relatedProjectId
        };
      })
    );
  },
});
