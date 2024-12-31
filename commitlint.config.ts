import type { UserConfig } from '@commitlint/types';
import util from 'util';
import { exec as exceute } from 'child_process';

const exec = util.promisify(exceute);

const Configuration: UserConfig = {
  helpUrl: `
  Commit messages must follow conventional commit format:
  https://www.conventionalcommits.org/en/v1.0.0/#summary
      <type>(<scope>): <description>

  * To bypass pre-commit hooks run 'git commit -m"your message" --no-verify'
  `,
  rules: {
    'scope-enum': async () => {
      const { stdout: branchName } = await exec('git branch --show-current');
      const [, ticket] = branchName.trim().split('/');
      return [2, 'always', [ticket]];
    },
    'scope-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'ci',
        'revert',
        'chore',
      ],
    ],
  },
};

export default Configuration;
