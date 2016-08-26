const React = require('react')
const { connect } = require('react-redux')
const SidebarContainer = require('./sidebar')
const RequestsContainer = require('./requests')

class App extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { requests } = this.props

    return <div className='app-container'>
             <SidebarContainer />
             <div className='body-container'>
               <RequestsContainer requests={requests} />
             </div>
           </div>
  }
}

App.propTypes = {
  requests: React.PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
  const {requests} = state
  return {requests}
}

module.exports = connect(mapStateToProps)(App)
