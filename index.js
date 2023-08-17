const core = require('@actions/core');
const exec = require('@actions/exec');

/**
 * Check if branch name exists as remote ref
 * @param {String} branch 
 * @returns {Boolean} 
 */
async function checkBranchExists(branch) {
  try {
    await exec.exec(`git ls-remote --heads --exit-code --quiet origin ${branch}`);
    return true;
  } catch(e) {
    if (e.message.includes('exit code 2')) {
      return false;
    }
    throw e;
  }
}

async function run() {
  try {
    const branch = core.getInput('branch-name');

    const branchExists = await checkBranchExists(branch);

    if (branchExists) {
      // Get the latest commit SHA, message, and author
      let latestCommitSHA = '';
      let latestCommitMessage = '';
      let latestCommitAuthor = '';
      await exec.exec(`git fetch origin ${branch}`);
      await exec.exec(`git log -1 --pretty=%H origin/${branch}`, [], {
        listeners: {
          stdout: (data) => {
            latestCommitSHA += data.toString();
          },
        },
      });
      await exec.exec(`git log -1 --pretty=%B origin/${branch}`, [], {
        listeners: {
          stdout: (data) => {
            latestCommitMessage += data.toString();
          },
        },
      });
      await exec.exec(`git log -1 --pretty=%an origin/${branch}`, [], {
        listeners: {
          stdout: (data) => {
            latestCommitAuthor += data.toString();
          },
        },
      });

      core.setOutput('commit-sha', latestCommitSHA.trim());
      core.setOutput('commit-message', latestCommitMessage.trim());
      core.setOutput('commit-author', latestCommitAuthor.trim());
    } else {
      console.log(`Remote ref ${branch} not found`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = { run };
run();
