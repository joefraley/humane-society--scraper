# Contributing

## Commit Convention

To commit code according to the message convention, do not use `git commit`.

```shell
git commit # don't use this

npm run commit # use this instead
```

## Merging Changes

This repo does not allow merge commits. Github will only allow rebases in pull-requests.

## Using Branches

The `master` branch is locked to all maintainers. All changes must be introduced first to `develop`. This allows us to automate releases easily using standard continuous deployment and integration tools.

## Opening Issues or Pull Requests

This code base uses standard templates for all issues and pull requests. These forms will be pre-populated when you open one. If you ignore these templates, we will close your requests or ask that you reformat them in accordance with the templates.
