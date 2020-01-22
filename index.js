const core = require('@actions/core');
const github = require('@actions/github');
const surge = require('surge')({ default: 'publish' });

const slug = branch => branch.replace(/[.]/, '-');

// most @actions toolkit packages have async methods
const run = async () => {
    try {
        const dist = core.getInput('dist-folder');
        process.env.SURGE_TOKEN = core.getInput('surge-token');
        process.env.SURGE_LOGIN = core.getInput('surge-login');
        const url = 'test-domain-sadfkjhio.surge.sh';

        console.log(`Deploying to surge.sh from ${dist}`);
        console.log(github.context);

        surge([dist, url]);

        core.setOutput('time', new Date().toTimeString());
        core.setOutput('surge-url', url);
    } catch (error) {
        core.setFailed(error.message);
    }
};

run();
