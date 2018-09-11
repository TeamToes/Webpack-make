#!/usr/bin/env node

// colorize the output
const chalk = require('chalk');
// clears the terminal screen
const clear = require('clear');
// creates ASCII art
const figlet = require('figlet');

const files = require('./lib/files.js');

const inquirer = require('./lib/inquirer');

const answersKey = require('./lib/answer');

// clears the terminal
clear();

// log the ASIIC art
console.log(
  chalk.yellow(figlet.textSync('Webpack-make', { horizontalLayout: 'full' }))
);

// run: starts the logic of the program
const run = async () => {
  const retrievePaths = await inquirer.retrievePath();
  // console.log(retrievePaths);
  console.log(generateModuleText(retrievePaths));
};
run();

function generateModuleText(object) {
  let answer = ``;
  let size = 0;
  let comma = 1;
  for (key in object) {
    size++;
  }
  if (size > 0) {
    if (object.dev_server === true) {
      if (object.hot_reload === false) {
        answer += `devServer: {
    contentBase: path.join(__dirname, '/'),
    port: 3001,
    publicPath: '/build',
  },
  `;
      } else {
        answer += `devServer: {
    contentBase: path.join(__dirname, '/'),
    port: 3001,
    hotOnly: true,
    publicPath: '/build',
  },
`;
      }
    }
    answer += `
  "module": {
    "rules": [
  `;

    // loop over answers checking for True
    for (key in object) {
      console.log(key);
      if (
        object[key] === true &&
        key !== 'dev_mode' &&
        key !== 'dev_server' &&
        key !== 'hot_reload' &&
        key !== 'prettier'
      ) {
        answer += answersKey[key];
        if (comma < size) {
          answer += `,`;
        }
        comma++;
      }
    }
    answer += `
  ]
}`;
  }

  return `
module.exports = {
  mode: '${object.development}',
  entry: '${object.entry_path}',
  output: {
    path: path.resolve(__dirname, '${object.destination_path}'),
    publicPath: '${object.destination_path}', 
    filename: '${object.filename}'
  },
  ${answer}
  resolve: { extensions: ['*', '.js']}
};`;
}
