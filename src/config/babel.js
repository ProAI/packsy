module.exports = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          browsers: '> 0.25%, ie 11, not dead',
          node: 8,
        },
      },
    ],
    require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-flow'),
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-proposal-class-properties'),
      { loose: false },
    ],
  ],
};
