# Serverless Vite

A [Serverless framework](https://www.serverless.com) plugin for Vite project bundling.

## Serverless configuration

- The plugin is configured within the `serverless.yaml` by adding the plugin to the list of plugins.
- By default, nothing else need to be configured. This plugin respect `vite.config` file.
- The `vite` [InlineConfig](https://vitejs.dev/guide/api-javascript.html#inlineconfig) can be added in `custom.vite` as shown in the example below. For more information about `vite` [UserConfig](https://vitejs.dev/config/), check out their document.

```yaml
plugins:
  - 'serverless-vite'

custom:
  vite:
    envResolution: 'process.env'
    inlineConfig:
      configFile: ./vite.config.ts
      envFile: false
      define:
        ENV_VARIABLE: 'double quoted string'
```
