const { splitImageParts } = require('../docker/extract');

module.exports = {
  extractDependencies,
};

function extractDependencies(content) {
  logger.debug('docker-compose.extractDependencies()');
  let deps = [];
  let lineNumber = 0;
  for (const line of content.split('\n')) {
    const match = line.match(/^\s*image:\s*'?"?([^\s'"]+)'?"?\s*$/);
    if (match) {
      const currentFrom = match[1];
      const {
        dockerRegistry,
        depName,
        currentTag,
        currentDigest,
        currentDepTagDigest,
        currentDepTag,
      } = splitImageParts(currentFrom);
      logger.info(
        { dockerRegistry, depName, currentTag, currentDigest },
        'Docker Compose image'
      );
      deps.push({
        lineNumber,
        currentFrom,
        currentDepTagDigest,
        dockerRegistry,
        currentDepTag,
        currentDigest,
        depName,
        currentTag,
      });
    }
    lineNumber += 1;
  }
  deps = deps.filter(dep => !(dep.currentTag && dep.currentTag.includes('${')));
  if (!deps.length) {
    return null;
  }
  return { deps };
}
