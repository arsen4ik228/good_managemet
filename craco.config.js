const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@app': path.resolve('src/desktop/UI/app/'),
      '@BLL': path.resolve('src/desktop/BLL/'),
      '@constants': path.resolve('src/desktop/UI/constants/'),
      '@Custom': path.resolve('src/desktop/UI/Custom/'),
      '@image': path.resolve('src/desktop/UI/image/'),
      '@sprite': path.resolve('src/desktop/UI/sprite/'),
      '@utils': path.resolve('src/desktop/UI/utils/'),
      '@hooks': path.resolve('src/desktop/UI/hooks/'),
    },
  },
};
