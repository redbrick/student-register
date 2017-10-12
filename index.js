const program = require('commander');
const prompt = require('prompt');
const importer = require('./importer.js');
const { version, description } = require('./package.json');

program
  .version(version)
  .description(description)
  .usage('<file> [options]')
  .parse(process.argv);

const file = program.args[0];
if (typeof file === 'undefined') {
  program.outputHelp();
  process.exit(1);
}

prompt.start();
prompt.get(
  {
    properties: {
      username: {
        pattern: /^[a-zA-Z0-9\s-]+$/,
        message: 'Name must be only letters, spaces, or dashes',
        required: true,
      },
      password: {
        hidden: true,
        required: true,
      },
    },
  },
  importer(file),
);
