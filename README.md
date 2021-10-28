<!-- ![Banner](.github/assets/banner-thin.png) -->

# Renovate Merge Action

![License](https://img.shields.io/github/license/MansaGroup/renovate-merge-action?style=flat-square) ![GitHub Issues](https://img.shields.io/github/issues/mansagroup/renovate-merge-action?style=flat-square) ![GitHub Stars](https://img.shields.io/github/stars/MansaGroup/renovate-merge-action?style=flat-square)

Renovate is a dependency management bot that one can use
to have its dependencies updated automatically. It is pretty
useful when you don't want to manage them manually, or at least,
do not want to manage minor ones.

This process is pretty simple and work perfectly, except if
your repository contains a `CODEOWNERS` file, protecting your
dependency files (i.e. the `package.json` or `package-lock.json`
if you are using Node.js). In this context, Renovate will not
be able to auto-merge its pull requests if all the checks pass,
and its pull requests will be forgiven because you have no
time for Renovate...

This action will list all Renovate's pull requests, find the
first one passing all the checks and merge it. **As simple as that.**

## Usage

This will find the more appropriate pull request from Renovate,
with passing statuses and checks. **As simple as that.**

> workflow.yml

```yaml
- uses: mansagroup/renovate-merge-action@v2
```

## Inputs

This GitHub action can take several inputs to configure its behaviors:

| Name        | Type   | Default               | Example | Description                                             |
| ----------- | ------ | --------------------- | ------- | ------------------------------------------------------- |
| githubToken | String | ${{ github.context }} | `xxx`   | The GitHub token used to create an authenticated client |

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
<table>
  <tr>
    <td align="center"><a href="https://jeremylvln.fr/"><img src="https://avatars.githubusercontent.com/u/6763873?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jérémy Levilain</b></sub></a><br /><a href="https://github.com/MansaGroup/renovate-merge-action/commits?author=IamBlueSlime" title="Code">💻</a> <a href="https://github.com/MansaGroup/renovate-merge-action/commits?author=IamBlueSlime" title="Documentation">📖</a> <a href="#ideas-IamBlueSlime" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
