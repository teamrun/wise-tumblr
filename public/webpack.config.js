module.exports = {
    entry: {
        api: './lib/app.js'
    },
    output: {
        path: './dist',
        filename: 'api-bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                loaders: ['style', 'css', 'less']
            }
        ]
    }

};
