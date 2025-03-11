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
            },
            {
                test: /\.js$/,
                include: /node_modules\/chart.js/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
