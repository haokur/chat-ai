const path = require('path');

module.exports = {
  webpack: function (config) {
    config.output.path = path.resolve(__dirname, 'build'); // 自定义输出目录
    config.output.publicPath = '/chat-ai';
    return config;
  },
};
