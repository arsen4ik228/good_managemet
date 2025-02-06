const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@app': path.resolve('src/desktop/UI/app/'),
      '@constants': path.resolve('src/constants/'),
      '@Custom': path.resolve('src/desktop/UI/Custom/'),
      '@image': path.resolve('src/desktop/UI/image/'),
      '@sprite': path.resolve('src/desktop/UI/sprite/'),
      '@utils': path.resolve('src/desktop/UI/utils/'),
     


      '@services': path.resolve('src/store/services/'),
      '@slices': path.resolve('src/store/slices/'),
      '@hooks': path.resolve('src/hooks/'),
      '@helpers': path.resolve('src/helpers'),
    },
  },
};
