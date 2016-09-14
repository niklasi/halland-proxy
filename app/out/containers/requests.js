const React = require('react');
const RequestPane = require('../components/request-pane');

module.exports = ({ requests }) => {
  const mapper = (req, index) => React.createElement(RequestPane, { key: index, request: req.request, response: req.response });

  return React.createElement(
    'div',
    { className: 'requests-container' },
    requests.map(mapper)
  );
};
//# sourceMappingURL=requests.js.map