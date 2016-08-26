const React = require('react')
const { connect } = require('react-redux')
const HeaderContainer = require('./header')
const FooterContainer = require('./footer')
const RequestsContainer = require('./requests')
const RequestContainer = require('./request')

class App extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { requests } = this.props

    return <div className='app-container'>
             <HeaderContainer />
             <div className='body-container'>
               <RequestsContainer requests={requests} />
               <RequestContainer />
             </div>
             <FooterContainer />
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
