const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@app': path.resolve('src/UI/app/'),
      '@constants': path.resolve('src/constants/'),
      '@Custom': path.resolve('src/UI/Custom/'),
      '@image': path.resolve('src/UI/image/'),
      '@sprite': path.resolve('src/UI/sprite/'),
      '@utils': path.resolve('src/UI/utils/'),
      '@services': path.resolve('src/store/services/'),
      '@slices': path.resolve('src/store/slices/'),
      '@hooks': path.resolve('src/hooks/'),
      '@helpers': path.resolve('src/helpers'),
    },
  },
};
