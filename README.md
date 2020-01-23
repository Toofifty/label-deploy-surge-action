# Label controlled Surge deploy action

Runs a build and deploy to surge.sh if the specified label is in the pull request.

Will name the surge domain either:

* Text in square brackets at the start of the PR title
  * `[test-77] Add thing` will become `test-77.surge.sh`
* First 8 digits of commit sha (if above not found)


## Options

`dist-folder`: distribution files to deploy
`surge-token`: surge login token
`surge-login`: surge login email
`label`: label to filter PRs
`build-script`: build script to run before deployment
