module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST"),
        port: env("SMTP_PORT"),
        auth: {
          user: env("SMTP_USERNAME"),
          pass: env("SMTP_PASSWORD"),
        },
        // ... any custom nodemailer options
      },
      secure: true,
      settings: {
        defaultFrom: "surfix@gmail.com",
        defaultReplyTo: "surfix@gmail.com",
      },
    },
  },
});
