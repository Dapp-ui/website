const path = require('path')


const nextConfig = {
  sassOptions: {
    additionalData: '@import "~src/scss/index.scss";',
    includePaths: [
      path.join(__dirname, 'styles'),
    ],
  },
}

module.exports = nextConfig
