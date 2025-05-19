import logger from '@acrool/js-logger';
import prompts from 'prompts';

import {defaultConfig} from '../../config.js';
import {bash, renameDockerImage} from '../../utils.js';
import {main as removeDocker} from '../remove/index.js';
import {IPushArgs} from './types.js';



export async function main(args?: IPushArgs) {



    const imageName = process.env.npm_package_name ?? defaultConfig.packageName;
    const imageVersion = process.env.npm_package_version ?? defaultConfig.packageVersion;
    const remoteAddress = process.env.npm_package_dockerRegistry ?? defaultConfig.dockerRegistry;

    console.log(`ready release ${imageName}:${imageVersion} ...`);

    // Build Image
    const targetImageName = renameDockerImage(imageName, imageVersion, remoteAddress);

    // Push Image
    bash(`docker push ${targetImageName}`);
    logger.success(`Successfully push to ${remoteAddress}`);

    // By OSX Notice
    bash(`osascript -e 'display notification "${targetImageName} done" with title "publish done"'`);

    const {confirmDelete} = await prompts({
        type: 'select',
        name: 'confirmDelete',
        message: 'do you want to delete it?',
        choices: [
            {title: 'Yes', value: 'y'},
            {title: 'No', value: 'n'},
        ],
    });
    if(confirmDelete === 'y'){
        removeDocker();
    }

}
