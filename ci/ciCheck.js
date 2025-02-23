'use strict'

const CiVersionCheck = require('./CiVersionCheck');
const allNodeVersions = require('all-node-versions');

async function check() {
  // Run checks
  await checkNodeVersions();
}

/**
 * Check the Nodejs versions used in test environments.
 */
async function checkNodeVersions() {

  const allVersions = await allNodeVersions();
  const releasedVersions = allVersions.versions;

  await new CiVersionCheck({
    packageName: 'Node.js',
    packageSupportUrl: 'https://github.com/nodejs/node/blob/master/CHANGELOG.md',
    yamlFilePath: './.github/workflows/ci.yml',
    ciEnvironmentsKeyPath: 'jobs.check-build.strategy.matrix.include',
    ciVersionKey: 'NODE_VERSION',
    releasedVersions,
    latestComponent: CiVersionCheck.versionComponents.minor,
    ignoreReleasedVersions: [
      '<12.0.0', // These versions have reached their end-of-life support date
      '>=13.0.0 <14.0.0', // These versions have reached their end-of-life support date
      '>=15.0.0 <16.0.0', // These versions have reached their end-of-life support date
      '>=16.0.0' // Parse Dashboard is currently not officially Node 16 compatible
    ],
  }).check();
}

check();
