"use strict";

module.exports = ({ strapi }) => ({
  // Find all Projects
  find: async (ctx) => {
    const projects = await strapi
      .plugin("github-projects")
      .service("projectService")
      .findMany(ctx.query);
    return projects;
  },
  // Find One Project
  findOne: async (ctx) => {
    const projectId = ctx.params.id;
    const project = await strapi
      .plugin("github-projects")
      .service("projectService")
      .findOne(ctx.query, projectId);
    return project;
  },
  // Create new Project
  create: async (ctx) => {
    const repo = ctx.request.body;
    const newProject = await strapi
      .plugin("github-projects")
      .service("projectService")
      .create(repo, ctx.state.user.id);
    return newProject;
  },
  // Create new Projects
  createMany: async (ctx) => {
    const { repos } = ctx.request.body;
    const newProjects = await strapi
      .plugin("github-projects")
      .service("projectService")
      .createMany(repos, ctx.state.user.id);
    return newProjects;
  },
  // Delete Project
  delete: async (ctx) => {
    const projectId = ctx.params.id;
    const deletedProject = await strapi
      .plugin("github-projects")
      .service("projectService")
      .delete(projectId);
    return deletedProject;
  },
  // Delete Many Projects
  deleteMany: async (ctx) => {
    const { projectIds } = ctx.query;
    const deletedProjects = await strapi
      .plugin("github-projects")
      .service("projectService")
      .deleteMany(projectIds);
    return deletedProjects;
  },
});
