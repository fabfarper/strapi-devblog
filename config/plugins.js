module.exports = ({ env }) => ({
  "github-projects": {
    enabled: true,
    resolve: "./src/plugins/github-projects",
  },
  email: {
    config: {
      provider: "sendgrid",
      providerOptions: {
        apiKey: env("SENDGRID_API_KEY"),
      },
      settings: {
        defaultFrom: "fabio.fariapereira@smile.fr",
        defaultReplyTo: "fabio.fariapereira@smile.fr",
      },
    },
  },
});
