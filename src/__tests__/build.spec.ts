import * as child_process from 'child_process';
import fs from 'fs';
import {beforeEach,describe, expect, it, Mock,vi} from 'vitest';

import * as utils from '../lib/build/utils';

vi.mock('child_process');
vi.mock('fs');
vi.mock('@acrool/js-logger', () => ({
    default: {
        info: vi.fn(),
        danger: vi.fn(),
        success: vi.fn(),
    }
}));
vi.mock('../utils', () => ({
    bash: vi.fn(),
    renameDockerImage: (name: string, version: string, remote: string) => `${remote}/${name}:${version}`,
    isEmpty: (v: any) => !v,
    CLIError: class extends Error {},
}));

describe('build docker cli', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should build docker image successfully', async () => {
    // mock dockerfile 存在
        (fs.existsSync as unknown as Mock).mockReturnValue(true);

        // mock child_process.spawn
        (child_process.spawn as unknown as Mock).mockReturnValue({
            stderr: {on: (event: string, cb: Function) => {}},
            on: (event: string, cb: Function) => {
                if (event === 'close') cb(0); // 模擬成功
            },
        });

        // 執行 build
        await expect(
            utils.buildDockerImage('test-image', '1.0.0', 'remote', 'Dockerfile', '/public')
        ).resolves.toBe('remote/test-image:1.0.0');
    });

    it('should fail if dockerfile not exists', async () => {
        (fs.existsSync as unknown as Mock).mockReturnValue(false);

        await expect(
            utils.buildDockerImage('test-image', '1.0.0', 'remote', 'Dockerfile', '/public')
        ).rejects.toThrow('dockerfile not exists');
    });

    it('should handle docker build error', async () => {
        (fs.existsSync as unknown as Mock).mockReturnValue(true);

        (child_process.spawn as unknown as Mock).mockReturnValue({
            stderr: {on: (event: string, cb: Function) => {}},
            on: (event: string, cb: Function) => {
                if (event === 'close') cb(1); // 模擬失敗
            },
        });

        await expect(
            utils.buildDockerImage('test-image', '1.0.0', 'remote', 'Dockerfile', '/public')
        ).rejects.toThrow('Failed to build project');
    });
});
