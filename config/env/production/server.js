module.exports = ({ env }) => ({
  url: env("RENDER_EXTERNAL_URL", "APP_URL"), // Sets the public URL of the application.
});
