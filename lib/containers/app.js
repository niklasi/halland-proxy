const React = require('react')
const HeaderContainer = require('./header')
const FooterContainer = require('./footer')
const RequestsContainer = require('./requests')
const RequestContainer = require('./request')

module.exports = () => {
  return <div className='app-container'>
           <HeaderContainer />
           <div className='body-container'>
             <RequestsContainer />
             <RequestContainer />
           </div>
           <FooterContainer />
         </div>
}
