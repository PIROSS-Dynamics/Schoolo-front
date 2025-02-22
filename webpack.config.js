module.exports = {
    resolve: {
      alias: {
        'mapbox-gl': 'mapbox-gl/dist/mapbox-gl.js'
      }
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false
          }
        }
      ]
    }
  };
  