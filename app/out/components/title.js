const ip = require('ip');
const packageJson = require('../../package.json');

module.exports = () => {
  const q = document.querySelector.bind(document);

  const title = q('title');
  title.innerText += packageJson.name + ' ' + ip.address();
};
//# sourceMappingURL=title.js.map