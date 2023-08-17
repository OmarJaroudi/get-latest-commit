const core = require('@actions/core');
const exec = require('@actions/exec');
const { run } = require('./index'); // Update the path to match the actual location of index.js

jest.mock('@actions/core');
jest.mock('@actions/exec');

describe('Get Latest Commit Info Action', () => {
  it('should set outputs for existing branch', async () => {
    exec.exec.mockImplementation((command, args, options) => {
      if (command === 'git ls-remote --exit-code --heads origin branch') {
        return 0; // Simulate branch exists
      }
      if (command.startsWith('git log -1')) {
        options.listeners.stdout('Test Commit Message\n');
        return 0;
      }
    });

    await run();

    expect(core.setOutput).toHaveBeenCalledWith('commit-sha', expect.any(String));
    expect(core.setOutput).toHaveBeenCalledWith('commit-message', 'Test Commit Message');
    expect(core.setOutput).toHaveBeenCalledWith('commit-author', expect.any(String));
  });

  it('should set outputs for non-existing branch', async () => {
    exec.exec.mockReturnValue(1); // Simulate branch doesn't exist

    await run();

    expect(core.setOutput).toHaveBeenCalledWith('commit-sha', '');
    expect(core.setOutput).toHaveBeenCalledWith('commit-message', '');
    expect(core.setOutput).toHaveBeenCalledWith('commit-author', '');
  });

  it('should handle errors', async () => {
    const errorMessage = 'An error occurred';
    exec.exec.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await run();

    expect(core.setFailed).toHaveBeenCalledWith(errorMessage);
  });
});
