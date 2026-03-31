module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('djfwceo4q'),
        api_key: env('843748867399732'),
        api_secret: env('TAxifivfxSZ0ktyDaVFBy15GYaU'),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
});