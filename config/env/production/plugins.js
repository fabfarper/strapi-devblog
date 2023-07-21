module.exports = ({ env }) => ({
  email: {
    email: {
      config: {
        provider: "sendgrid",
        providerOptions: {
          apiKey: env("SENDGRID_API_KEY"),
        },
        settings: {
          defaultFrom: "",
          defaultReplyTo: "",
        },
      },
    },
    // config: {
    //   provider: "nodemailer",
    //   providerOptions: {
    //     host: env("SMTP_HOST"),
    //     port: env("SMTP_PORT"),
    //     auth: {
    //       user: env("SMTP_USERNAME"),
    //       pass: env("SMTP_PASSWORD"),
    //     },
    //     // ... any custom nodemailer options
    //   },
    //   secure: true,
    //   settings: {
    //     defaultFrom: "surfix@gmail.com",
    //     defaultReplyTo: "surfix@gmail.com",
    //   },
    // },
  },
});
