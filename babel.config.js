module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@assets': './assets',
          '@screens': './src/Screens',
          '@types': './src/TypeScripts',
        },
      },
    ],
  ],
};