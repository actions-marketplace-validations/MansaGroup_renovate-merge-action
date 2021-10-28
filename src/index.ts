import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types';

type Inputs = {
  githubToken: string;
};

type Octokit = ReturnType<typeof getOctokit>;

const RENOVATE_BOT_LOGIN = 'renovate[bot]';
const RENOVATE_APPROVE_BOT_LOGIN = 'renovate-approve';

async function listRenovatePullRequests(
  octokit: Octokit,
): Promise<
  GetResponseDataTypeFromEndpointMethod<typeof octokit.rest.pulls.get>[]
> {
  const opts = octokit.rest.issues.listForRepo.endpoint.merge({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: 'open',
    creator: RENOVATE_BOT_LOGIN,
  });

  const issues = await octokit
    .paginate<
      GetResponseDataTypeFromEndpointMethod<typeof octokit.rest.issues.get>
    >(opts)
    .then((issues) => issues.filter((issue) => issue.pull_request));

  const pullRquests = await Promise.all(
    issues.map((issue) =>
      octokit.rest.pulls
        .get({
          owner: context.repo.owner,
          repo: context.repo.repo,
          pull_number: issue.number,
        })
        .then((res) => res.data),
    ),
  );

  pullRquests.forEach((pullRequest) =>
    core.info(
      `Found pull request ${pullRequest.number} (${pullRequest.title}).`,
    ),
  );

  return pullRquests;
}

async function isPullRequestReady(
  octokit: Octokit,
  pullRequest: GetResponseDataTypeFromEndpointMethod<
    typeof octokit.rest.pulls.get
  >,
  skip: (
    pullRequest: GetResponseDataTypeFromEndpointMethod<
      typeof octokit.rest.pulls.get
    >,
    why: string,
  ) => void,
): Promise<boolean> {
  const commitStatus = await octokit.rest.repos
    .getCombinedStatusForRef({
      owner: context.repo.owner,
      repo: context.repo.repo,
      ref: pullRequest.head.sha,
    })
    .then((res) => res.data.state);

  if (commitStatus !== 'success') {
    skip(pullRequest, 'last commit status is not success');
    return false;
  }

  const opts = octokit.rest.checks.listForRef.endpoint.merge({
    owner: context.repo.owner,
    repo: context.repo.repo,
    ref: pullRequest.head.sha,
  });

  const checks = await octokit.paginate<
    GetResponseDataTypeFromEndpointMethod<typeof octokit.rest.checks.get>
  >(opts);
  const conclusions = checks.map((check) => check.conclusion);

  if (!conclusions.every((conclusion) => conclusion === 'success')) {
    skip(pullRequest, 'one or more check has not succeeded');
    return false;
  }

  const reviews = await octokit.rest.pulls
    .listReviews({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: pullRequest.number,
    })
    .then((res) => res.data);

  const renovateApproveReview = reviews.find(
    (review) => review.user?.login === RENOVATE_APPROVE_BOT_LOGIN,
  );

  if (!renovateApproveReview || renovateApproveReview.state !== 'APPROVED') {
    skip(pullRequest, 'missing renovate-approve review');
    return false;
  }

  return true;
}

async function selectBestPullRequest(
  octokit: Octokit,
  pullRequests: GetResponseDataTypeFromEndpointMethod<
    typeof octokit.rest.pulls.get
  >[],
): Promise<GetResponseDataTypeFromEndpointMethod<
  typeof octokit.rest.pulls.get
> | null> {
  const skip = (
    pullRequest: GetResponseDataTypeFromEndpointMethod<
      typeof octokit.rest.pulls.get
    >,
    why: string,
  ) => {
    core.info(
      `Skipping pull request ${pullRequest.number} (${pullRequest.title}): ${why}.`,
    );
  };

  for (const pullRequest of pullRequests) {
    if (pullRequest.draft) {
      skip(pullRequest, 'is in draft');
      continue;
    } else if (!pullRequest.mergeable) {
      skip(pullRequest, 'not mergeable');
      continue;
    } else if (!(await isPullRequestReady(octokit, pullRequest, skip))) {
      continue;
    }

    return pullRequest;
  }

  return null;
}

async function main(): Promise<void> {
  const inputs: Inputs = {
    githubToken: core.getInput('githubToken', { required: true }),
  };

  const octokit = getOctokit(inputs.githubToken, {
    log: console,
  });

  return core
    .group(`🔍 Listing Renovate's pull requests`, () =>
      listRenovatePullRequests(octokit),
    )
    .then((pullRequests) =>
      core.group(`⚖️ Selecting best pull request`, () =>
        selectBestPullRequest(octokit, pullRequests),
      ),
    )
    .then(async (pullRequest) => {
      if (!pullRequest) {
        core.info('✅ No pull request ready to be merged.');
        return;
      }

      core.info(
        `✨ Merging pull request ${pullRequest.number} (${pullRequest.title}).`,
      );

      await octokit.rest.pulls.merge({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: pullRequest.number,
      });
    });
}

void main();
