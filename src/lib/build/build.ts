import logger from '@acrool/js-logger';
import prompts from 'prompts';

import {defaultConfig} from '../../config.js';
import {bash} from '../../utils.js';
import {main as pushDocker} from '../push/index.js';
import {IBuildArgs} from './types.js';
import {buildDockerImage} from './utils.js';


export async function main(args: IBuildArgs) {

    const imageName = process.env.npm_package_name ?? defaultConfig.packageName;
    const imageVersion = process.env.npm_package_version ?? defaultConfig.packageVersion;
    const remoteAddress = process.env.npm_package_dockerRegistry ?? defaultConfig.dockerRegistry;
    const publicUrl = typeof args?.publicUrl !== 'undefined' ? args.publicUrl: defaultConfig.publicUrl;
    const dockerfile = typeof args?.dockerfile !== 'undefined' ? args.dockerfile: defaultConfig.dockerfilePath;

    console.log(`ready release ${imageName}:${imageVersion} ...`);

    try {
        // Build Image
        const targetImageName = await buildDockerImage(imageName, imageVersion, remoteAddress, dockerfile, publicUrl);

        // By OSX Notice
        bash(`osascript -e 'display notification "${targetImageName} done" with title "build done"'`);

        const response = await prompts({
            type: 'select',
            name: 'confirmPush',
            message: 'do you want to push it?',
            choices: [
                {title: 'Yes', value: 'y'},
                {title: 'No', value: 'n'}
            ]
        });
        if(response.confirmPush === 'y'){
            pushDocker();
        }

    }catch (e: any){
        if(e instanceof Error){
            logger.danger(e.message);
        }else{
            logger.danger(e);
        }
    }
}
