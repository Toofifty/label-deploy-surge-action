const core = require('@actions/core');
const github = require('@actions/github');
const surge = require('surge')({ default: 'publish' });

const TASK_REGEX = /^\[([\w-\d]+)\]/;

const slug = branch => branch.toLowerCase().replace(/[.]/, '-');

const makeDomain = pullRequest => {
    const { sha } = github.context;
    const { title } = pullRequest;

    const titleMatch = title.match(TASK_REGEX);

    if (titleMatch) {
        return slug(titleMatch[1]);
    }

    return sha.substring(0, 8);
};

const shouldDeploy = pullRequest => {
    const label = core.getInput('label');

    return (
        pullRequest && pullRequest.labels && pullRequest.labels.includes(label)
    );
};

const run = async () => {
    try {
        const { pull_request: pullRequest } = github.context.payload;
        if (!shouldDeploy(pullRequest)) {
            console.log('Label not found, skipping');
            return;
        }

        const domain = makeDomain(pullRequest);
        const dist = core.getInput('dist-folder');
        process.env.SURGE_TOKEN = core.getInput('surge-token');
        process.env.SURGE_LOGIN = core.getInput('surge-login');

        console.log(`Deploying to surge.sh from ${dist}`);
        console.log(github.context);

        surge([dist, domain]);

        core.setOutput('time', new Date().toTimeString());
        core.setOutput('surge-url', domain);
    } catch (error) {
        core.setFailed(error.message);
    }
};

run();
