const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('@actions/exec');
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
        pullRequest &&
        pullRequest.labels &&
        !!pullRequest.labels.find(({ name }) => name === label)
    );
};

const run = async () => {
    try {
        const { pull_request: pullRequest } = github.context.payload;
        if (!shouldDeploy(pullRequest)) {
            console.log('Label not found, skipping');
            console.log(pullRequest);
            return;
        }

        const script = core.getInput('build-script');
        if (script) {
            console.log('Running build script');
            await exec(script);
        }

        const domain = makeDomain(pullRequest) + '.surge.sh';
        const dist = core.getInput('dist-folder');
        process.env.SURGE_TOKEN = core.getInput('surge-token');
        process.env.SURGE_LOGIN = core.getInput('surge-login');

        console.log(`Deploying to ${domain} from ${dist}`);

        surge([dist, domain]);

        core.setOutput('surge-url', domain);
    } catch (error) {
        core.setFailed(error.message);
    }
};

run();
