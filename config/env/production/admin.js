module.exports = ({ env }) => {
  return {
    url: env("PUBLIC_ADMIN_URL", "/admin"),
    serveAdminPanel: env("PUBLIC_ADMIN_URL") == undefined, // If no public admin url, serve the Admin Panel on the same server
  };
};
