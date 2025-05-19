import logger from '@acrool/js-logger';

import {defaultConfig} from '../../config.js';
import {bash, renameDockerImage} from '../../utils.js';
import {IRemoveArgs} from './types.js';



export async function main(args?: IRemoveArgs) {

    const imageName = process.env.npm_package_name ?? defaultConfig.packageName;
    const imageVersion = process.env.npm_package_version ?? defaultConfig.packageVersion;
    const remoteAddress = process.env.npm_package_dockerRegistry ?? defaultConfig.dockerRegistry;

    // Build Image
    const targetImageName = renameDockerImage(imageName, imageVersion, remoteAddress);

    // Remove Image
    bash(`docker rmi ${imageName} ${targetImageName}`);
    logger.info(`remove image ${imageName}`);

    // By OSX Notice
    bash(`osascript -e 'display notification "${targetImageName} done" with title "remove done"'`);

}
