const process = require('process');
const path = require('path');
const { __commit_hash } = require(path.join(__dirname, '..', '..', '..', process.argv[2]));

const expectedCommitHash = process.env.GITHUB_SHA;
if (!expectedCommitHash) {
  console.error('No GITHUB_SHA specified');
  process.exit(1);
}
if (expectedCommitHash !== __commit_hash) {
  console.error('Expected: ' + expectedCommitHash + ', got: ' + __commit_hash);
  process.exit(2);
}
console.log('✔️ Referencing the correct version of fast-check');
console.log('✔️ Commit hash matches expected one: ' + expectedCommitHash);
