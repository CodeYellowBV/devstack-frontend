# devstack-frontend
This is a default setup using [Webpack](https://webpack.github.io/) as module builder for all assets.

Javascript can be written in ES6 and is transpiled to ES5 using [Babel](https://babeljs.io/). [BackboneJS](http://backbonejs.org/) with [MarionetteJS](http://marionettejs.com/) and [Lodash](https://lodash.com) is used as framework.

Styles are preprocessed by [Sass](http://sass-lang.com/) and then by [Postcss](https://github.com/postcss/postcss).

This frontend needs a backend to work. An example backend will be made at some time in the not so distant future.

## Usage
Copy `.env.example` to `.env` and change it to your likings. If you want a custom location for the dotenv file, use `CY_ENV_FILE=/home/obama/.env`.

Run `npm install` and wait for an eternity. Start development by running `npm start`.

Use `npm test` to run the unit tests.

Use `npm run build` to generate a build in the `dist/` directory. Optionally cleanup after with `npm run clean`.
