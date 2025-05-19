#!/usr/bin/env node

import {Command} from 'commander';

import {main as buildDocker} from '../lib/build/index.js';
// import {main as pushDocker} from '../lib/push/index.js';
// import {main as removeDocker} from '../lib/remove/index.js';

const program = new Command();

program
    .version('1.0.0')
    .command('build')
    .option('-u, --publicUrl <path>', 'react-script build public url (ex: /recommend)')
    .option('-f, --dockerfile <path>', 'custom dockerfile path (ex: ./)', './node_modules/@acrool/node-docker-cli/config/react/Dockerfile')
    .action(buildDocker);

// program
//     .command('push')
//     .action(pushDocker);
//
// program
//     .command('remove')
//     .action(removeDocker);

program.parse(process.argv);

const command = program.args[0];
if (!['build','push','remove'].includes(command)) {
    console.error('Invalid command');
    process.exit(1);
}
