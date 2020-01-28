module.exports = {
  publicRuntimeConfig: {
    serverEndpoint: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : '/api',
  },
}
