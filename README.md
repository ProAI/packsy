# 📦 Packsy

This package helps you to set up a new npm package blazing fast. Use eslint, prettier, babel and rollup with zero configuration.

🛠 See [packsy-starter](https://github.com/ProAI/packsy-starter) for usage example and starter kit.

## Installation

```shell
npm install packsy
# or
yarn add packsy
```

## Commands

| Name                | Description                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| `packsy build`      | Builds production ready bundles with Rollup. Output directory is `dist`. |
| `packsy dev`        | Compiles files for development with Babel. Output directory is `lib`.    |
| `packsy format`     | Formats all files. All Prettier cli options can be used.                 |
| `packsy lint`       | Lints all files. All ESLint cli options can be used.                     |
| `packsy pre-commit` | Formats and lints all staged files, validates `package.json`.            |
| `packsy validate`   | Lints all files. validates `package.json`.                               |

## Prettier and ESLint configs

The package provides a default Prettier and ESLint configuration. See `.prettierrc.js` and `.eslintrc.js` in [packsy-starter](https://github.com/ProAI/packsy-starter) for usage.

## Development workflow (linked package)

Link the package as usual using yarn's or npm's `link`/`unlink` commands first. Then execute `packsy dev`.

`packsy dev` compiles all files with babel in watch mode, so that a file will be compiled every time that you change it.

## Projects that use Packsy

- 🚚 [react-transporter](https://github.com/ProAI/react-transporter)
- 🎨 [react-essentials](https://github.com/ProAI/react-essentials)
- 📥 [react-stacks](https://github.com/ProAI/react-stacks)
- 🏷️ [react-metadata](https://github.com/ProAI/react-metadata)
- 🌍 [intlized-components](https://github.com/ProAI/intlized-components)
- 🌟 [extended-components](https://github.com/ProAI/extended-components)

## FAQ

**What is the difference between `packsy build` and `packsy dev`?**

First the output folders are different (`dist` for build and `lib` for dev command). Second the build command uses Rollup (with Babel) while dev uses only Babel. Using only Babel leads to faster compile times, which is useful for development. Also the dev command uses the watch mode of Babel.

## Inspiration

This package is inspired by Kent C. Dodds's awesome package [kcd-scripts](https://github.com/kentcdodds/kcd-scripts).

## License

This package is released under the [MIT License](LICENSE).
