import type Serverless from 'serverless';
import type ServerlessPlugin from 'serverless/classes/Plugin';
import { build, InlineConfig } from 'vite';

function defineProcessEnv(envVars: Record<string, unknown> | undefined) {
    const processEnv: Record<string, string> = {};
    for (const env in envVars) {
        if (envVars[env] === undefined) {
            throw `${env} is undefined`;
        }

        processEnv[`process.env.${env}`] = JSON.stringify(envVars[env]);
    }
    return processEnv;
}

async function bundle(this: ServerlessVite) {
    await build(this.inlineConfig);
    console.log('Build complete! No errors were found.');
}

class ServerlessVite implements ServerlessPlugin {
    serverless: Serverless;
    options: Serverless.Options;
    hooks: ServerlessPlugin.Hooks;

    serviceFolderPath: string;
    envResolution: 'import.meta.env' | 'process.env';
    inlineConfig: InlineConfig;

    bundle: typeof bundle;

    constructor(serverless: Serverless, options: Serverless.Options) {
        this.serverless = serverless;
        this.options = options;
        this.serviceFolderPath = this.serverless.serviceDir;
        this.inlineConfig =
            this.serverless.service.custom?.['vite']?.inlineConfig ?? {};
        this.envResolution =
            this.serverless.service.custom?.['vite']?.envResolution ?? false;

        this.bundle = bundle.bind(this);

        this.hooks = {
            initialize: () => this.initialize(),
            'before:run:run': async () => {
                await this.bundle();
            },
            'before:package:createDeploymentArtifacts': async () => {
                await this.bundle();
            },
        };
    }

    private initialize() {
        if (this.envResolution === 'process.env') {
            this.inlineConfig.define = defineProcessEnv(
                this.inlineConfig.define
            );
        }
    }
}

export = ServerlessVite;
