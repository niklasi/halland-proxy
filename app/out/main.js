const React = require('react');
const { render } = require('react-dom');
const { Provider } = require('react-redux');
const App = require('./out/containers/app');
const configureStore = require('./out/store/configureStore');
const proxy = require('./out/proxy')();
const injectTapEventPlugin = require('react-tap-event-plugin');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;

injectTapEventPlugin();

require('./out/components/title')();

const store = configureStore();

//   const req = ctx.clientToProxyRequest
//   const resp = ctx.proxyToClientResponse

//   ctx.onResponseData((c, chunk, cb) => {
//     console.log(chunk.toString())
//     return cb(null, chunk)
//   })

//   store.dispatch(addRequest(req, resp))
//   cb()
// })

//
//   const req = ctx.clientToProxyRequest
//   console.log('request', ctx)
//   // store.dispatch(addRequest(req))
//   cb()
// })

// proxy.onResponseEnd((ctx, cb) => {
//   const resp = ctx.clientToProxyResponse
//   console.log('Response', resp.headersSent)
//   store.dispatch(addResponse(resp))
//   cb()
// })

const port = 8888;
proxy.listen({ port }, err => {
  if (err) throw err;
  console.log(`Renderer Server started on port ${ port }...`);
});

render(React.createElement(
  Provider,
  { store: store },
  React.createElement(
    MuiThemeProvider,
    null,
    React.createElement(App, null)
  )
), document.getElementById('mount'));
//# sourceMappingURL=main.js.map