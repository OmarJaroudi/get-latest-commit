import * as core from '@actions/core';
import * as exec from '@actions/exec';

/**
 * Check if branch name exists as remote ref
 * @param {string} branch
 * @returns {Promise<boolean>}
 */
async function checkBranchExists(branch: string): Promise<boolean> {
  try {
    await exec.exec(`git ls-remote --heads --exit-code --quiet origin ${branch}`);
    return true;
  } catch (e) {
    if (e.message.includes('exit code 2')) {
      return false;
    }
    throw e;
  }
}

export async function run(): Promise<void> {
  try {
    const branch: string = core.getInput('branch-name');

    const branchExists: boolean = await checkBranchExists(branch);

    if (branchExists) {
      // Get the latest commit SHA, message, author, and committer
      let latestCommitSHA = '';
      let latestCommitMessage = '';
      let latestCommitAuthor = '';
      let latestCommitCommitter = '';

      await exec.exec(`git fetch origin ${branch}`);
      await exec.exec(`git log -1 --pretty=%H origin/${branch}`, [], {
        listeners: {
          stdout: (data: Buffer) => {
            latestCommitSHA += data.toString();
          },
        },
      });
      await exec.exec(`git log -1 --pretty=%B origin/${branch}`, [], {
        listeners: {
          stdout: (data: Buffer) => {
            latestCommitMessage += data.toString();
          },
        },
      });
      await exec.exec(`git log -1 --pretty=%an origin/${branch}`, [], {
        listeners: {
          stdout: (data: Buffer) => {
            latestCommitAuthor += data.toString();
          },
        },
      });
      await exec.exec(`git log -1 --pretty=%cn origin/${branch}`, [], {
        listeners: {
          stdout: (data: Buffer) => {
            latestCommitCommitter += data.toString();
          },
        },
      });

      core.setOutput('commit-sha', latestCommitSHA.trim());
      core.setOutput('commit-message', latestCommitMessage.trim());
      core.setOutput('commit-author', latestCommitAuthor.trim());
      core.setOutput('commit-committer', latestCommitCommitter.trim());
    } else {
      console.log(`Remote ref ${branch} not found`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
