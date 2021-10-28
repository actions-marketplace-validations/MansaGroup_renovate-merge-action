<!-- ![Banner](.github/assets/banner-thin.png) -->

# Renovate Merge Action

![License](https://img.shields.io/github/license/MansaGroup/renovate-merge-action?style=flat-square) ![GitHub Issues](https://img.shields.io/github/issues/mansagroup/renovate-merge-action?style=flat-square) ![GitHub Stars](https://img.shields.io/github/stars/MansaGroup/renovate-merge-action?style=flat-square)

TODO.

## Usage

This will find the more appropriate pull request from Renovate,
with passing statuses and checks and which have an approval
from `renovate-approve`. **As simple like that.**

> workflow.yml

```yaml
- uses: mansagroup/renovate-merge-action@v2
```

## Inputs

This GitHub action can take several inputs to configure its behaviors:

| Name        | Type   | Default | Example | Description                                             |
| ----------- | ------ | ------- | ------- | ------------------------------------------------------- |
| githubToken | String | ø       | `xxx`   | The GitHub token used to create an authenticated client |

## Examples

### Use a custom GitHub token

You way want to use a custom GitHub token to merge the pull
request on behalf of someone else, or an app. You can provide
an optional `githubToken` input with a custom token.

> workflow.yml

```yaml
- uses: mansagroup/renovate-merge-action@v2
  with:
    githubToken: xxx
```

## License

This project is [MIT licensed](LICENSE.txt).

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
