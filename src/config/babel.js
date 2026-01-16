module.exports = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          browsers: '> 0.25%, ie 11, not dead',
          node: 16,
        },
        modules: false,
      },
    ],
    require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-typescript'),
  ],
};
