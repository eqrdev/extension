### WebStorm 

#### Upgrading yarn

1. Run this for the latest yarn version. This will update the `.yarn/releases/yarn-<version>.cjs` file, the  
`.yarnrc.yml` yarnPath option, and the packageManager field of the `package.json`.
    
        $ yarn set version canary

2. Though, you need to update manually the `volta.yarn` field of `package.json`. 
3. Open Settings → Languages and Frameworks → Node.js in WebStorm and set the `Package manager` field to the absolute 
   path of the `.yarn/releases/yarn-<version>.cjs` file.
4. Unfortunately we have to upgrade the `modules/enquiry-checker/crontab` file too, which contains
   the exact release of yarn.


#### Upgrading Node.js

1. Use nvm, n, or volta to install the latest version.
2. Update the `volta.node` field of `package.json` to the corresponding version.
3. Open Settings → Languages and Frameworks → Node.js in WebStorm and set the `Node interpreter` field to the absolute
   path of the node executable.
4. Replace the version number in the Dockerfile's `FROM` line.
