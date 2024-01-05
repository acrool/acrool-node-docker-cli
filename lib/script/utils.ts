import {execSync} from 'child_process';
const options = {stdio:[0, 1, 2]};

export const bash = (cmd: string) => {
    execSync(cmd, options);
};


/**
 * 重新命名 Docker Image
 * @param imageName
 * @param version
 * @param remoteAddress
 */
export const renameDockerImage = (imageName: string, version: string, remoteAddress: string): string => {
    return `${remoteAddress}/${imageName}:${version}`;
};


/**
 * 判定是否為空
 * @param value
 * @param checkOption
 * @returns {boolean}
 */
export function isEmpty(value: any, checkOption?: {
    isZero?: boolean,
    isFalse?: boolean,
}): value is undefined {
    const defaultCheckOption = {
        isZero: checkOption?.isZero ?? true,
        isFalse: checkOption?.isFalse ?? true,
    };
    return (
        value === undefined
        || value === null
        || (defaultCheckOption.isFalse && (value === false || value === 'false'))
        || (defaultCheckOption.isZero && (value === 0 || value === '0'))
        || (!(value instanceof Date) && typeof value === 'object' && Object.keys(value).length === 0)
        || (typeof value === 'string' && value.trim().length === 0)
    );
}
