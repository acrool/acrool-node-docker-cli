import logger from '@acrool/js-logger';
import chalk from 'chalk';
import child_process from 'child_process';
import fs from 'fs';
import ora from 'ora';

import {bash, CLIError, isEmpty, renameDockerImage} from '../../utils.js';

/**
 * Object.keys 型別增強
 * @param object
 */
export function objectKeys<T extends object>(object: T): Array<keyof T> {
    return Object.keys(object) as Array<keyof T>;
}



interface IOptions {
    publicUrl?: string
}


/**
 * Build docker image
 * @param imageName
 * @param version
 * @param remoteAddress
 * @param dockerfile
 * @param publicUrl
 */
export function buildDockerImage(imageName: string, version: string, remoteAddress: string, dockerfile: string, publicUrl?: string): Promise<string> {

    return new Promise((resolve, reject) => {
        const options: IOptions = {
            publicUrl: isEmpty(publicUrl) ? undefined: `PUBLIC_URL=${publicUrl}`,
        };
        const optionsLength = objectKeys(options).filter((key)=> typeof options[key] !== 'undefined').length;
        const buildArgTag = optionsLength > 0 ? '--build-arg': undefined;

        const dockerBuildArgs = ['build', '-t', imageName, '-f', dockerfile, buildArgTag, options.publicUrl, '.']
            .filter(arg => typeof arg !== 'undefined') as string[];

        logger.info(
            `Building ${chalk.dim(
                `(using "docker ${dockerBuildArgs.join(' ')}")`,
            )}`
        );

        // 檢查Docker存在
        if (!fs.existsSync(dockerfile)) {
            throw new Error('dockerfile not exists, please check your dockerfile path');
        }

        const loader = ora();
        const buildProcess = child_process.spawn('docker', dockerBuildArgs,{
            env: {
                ...process.env,
                RCT_NO_LAUNCH_PACKAGER: 'true',
            },
        });
        let buildOutput = '';

        // docker build 例外使用 stderr, 不是 std
        buildProcess.stderr.on('data', (data: Buffer) => {
            const stringData = data.toString();
            buildOutput += stringData;

            loader.start(
                `Building the app${'.'.repeat(buildOutput.length % 10)}`,
            );
        });

        buildProcess.on('close', (code: number) => {

            loader.stop();

            if (code !== 0) {
                const msg = `Failed to build project.
            We ran "docker build" command but it exited with error code ${code}. To debug build
            logs further.`;
                logger.danger(msg);
                reject(new CLIError(msg, buildOutput));
                return;
            }

            const targetImageName = renameDockerImage(imageName, version, remoteAddress);
            bash(`docker tag ${imageName} ${targetImageName}`);

            logger.success(`Successfully built the app: ${targetImageName}`);

            resolve(targetImageName);
            return;
        });
    });
}
