const React = require('react');
const { connect } = require('react-redux');
const RequestsContainer = require('./requests');
const SidebarContainer = require('./sidebar');
const AppBar = require('material-ui/AppBar').default;

const App = ({ requests }) => React.createElement(
  'div',
  { className: 'app-container' },
  React.createElement(SidebarContainer, null),
  React.createElement(
    'main',
    { className: 'main-container' },
    React.createElement(AppBar, { title: 'Proxy' }),
    React.createElement(RequestsContainer, { requests: requests })
  )
);

App.propTypes = {
  requests: React.PropTypes.array.isRequired
};

const mapStateToProps = state => {
  const { requests } = state;
  return { requests };
};

module.exports = connect(mapStateToProps)(App);
//# sourceMappingURL=app.js.map