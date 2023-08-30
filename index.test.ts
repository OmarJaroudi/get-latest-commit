import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { run } from './index';

jest.mock('@actions/core');
jest.mock('@actions/exec');

describe('Get Latest Commit Info Action', () => {
  it('should set outputs for existing branch', async () => {
    (exec.exec as jest.Mock).mockImplementation((command, args, options) => {
      if (command === `git ls-remote --heads origin branch`) {
        return 0; // Simulate branch exists
      }
      if (command.startsWith('git log -1')) {
        options.listeners.stdout('Test Commit Message\n');
        return 0;
      }
      return 0;
    });

    await run();

    expect(core.setOutput).toHaveBeenCalledWith('sha', expect.any(String));
    expect(core.setOutput).toHaveBeenCalledWith('message', 'Test Commit Message');
    expect(core.setOutput).toHaveBeenCalledWith('author', expect.any(String));
    expect(core.setOutput).toHaveBeenCalledWith('committer', expect.any(String));
  });

  it('should set outputs for non-existing branch', async () => {
    (exec.exec as jest.Mock).mockReturnValue(1); // Simulate branch doesn't exist

    await run();

    expect(core.setOutput).toHaveBeenCalledWith('sha', '');
    expect(core.setOutput).toHaveBeenCalledWith('message', '');
    expect(core.setOutput).toHaveBeenCalledWith('author', '');
    expect(core.setOutput).toHaveBeenCalledWith('committer', '');
  });

  it('should handle errors', async () => {
    const errorMessage = 'An error occurred';
    (exec.exec as jest.Mock).mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await run();

    expect(core.setFailed).toHaveBeenCalledWith(errorMessage);
  });
});
