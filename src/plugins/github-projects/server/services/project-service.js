"use strict";

module.exports = ({ strapi }) => ({
  findMany: async (params) => {
    const projects = await strapi.entityService.findMany(
      "plugin::github-projects.project",
      params
    );
    return projects;
  },

  findOne: async (params, projectId) => {
    const project = await strapi.entityService.findOne(
      "plugin::github-projects.project",
      projectId,
      params
    );
    return project;
  },

  create: async (repo, userId) => {
    const newProject = await strapi.entityService.create(
      "plugin::github-projects.project",
      {
        data: {
          repositoryId: `${repo.id}`,
          title: repo.name,
          shortDescription: repo.shortDescription,
          repositoryUrl: repo.url,
          longDescription: repo.longDescription,
          createdBy: userId,
          updatedBy: userId,
        },
      }
    );
    return newProject;
  },

  createMany: async (repos, userId) => {
    const newProjectsPromises = repos.map(
      async (repo) =>
        await strapi
          .plugin("github-projects")
          .service("projectService")
          .create(repo, userId)
    );
    return Promise.all(newProjectsPromises);
  },

  delete: async (projectId) => {
    const deletedProject = await strapi.entityService.delete(
      "plugin::github-projects.project",
      projectId
    );
    return deletedProject;
  },

  deleteMany: async (projectIds) => {
    const deletedProjectsPromises = projectIds.map(
      async (projectId) =>
        await strapi
          .plugin("github-projects")
          .service("projectService")
          .delete(projectId)
    );
    return Promise.all(deletedProjectsPromises);
  },
});
