# Get Latest Commit

This action retrieves information about the latest commit on a specified branch, including the commit SHA, message, author, and committer.

[![Actions](https://github.com/actions/javascript-action/workflows/units-test/badge.svg)](https://github.com/OmarJaroudi/get-latest-commit/actions/workflows/test.yml?query=branch%3Amain)
[![License](https://img.shields.io/github/license/OmarJaroudi/get-latest-commit)](./LICENSE)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/OmarJaroudi/get-latest-commit/issues)

## Inputs
- `branch-name`: Name of the branch (required) 

## Outputs
- `sha`: latest commit SHA
- `author`: latest commit author
- `message`: latest commit message
- `committer`: latest commit committer

## Example

You can use this action in your workflow like so:

```
- id: latest-commit
  uses: OmarJaroudi/get-latest-commit@v1
  with:
    branch-name: my_branch
- name: Print commit information
  run: |
    echo "Commit SHA: ${{ steps.latest-commit.outputs.sha }}"
    echo "Commit Message: ${{ steps.latest-commit.outputs.message }}"
    echo "Commit Author: ${{ steps.latest-commit.outputs.author }}"
    echo "Committer: ${{ steps.latest-commit.outputs.committer }}"
```