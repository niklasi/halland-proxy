import React from 'react'
import PropTypes from 'prop-types'
import RequestPane from './request-pane'
import { connect } from 'react-redux'
import { List, AutoSizer } from 'react-virtualized'
import ChipInput from 'material-ui-chip-input'
import { updateFilter } from '../../actions'

/* eslint-disable react/jsx-indent */
class RequestContainer extends React.Component {
  constructor (props) {
    super(props)
    this.rowRenderer = this.rowRenderer.bind(this)
  }

  componentDidUpdate () {
    if (this.props.ui.displayFilter) this.chipInput.focus()
  }

  rowRenderer ({
      key,         // Unique key within array of rows
      index,       // Index of row within collection
      isScrolling, // The List is currently being scrolled
      isVisible,   // This row is visible within the List (eg it is not an overscanned row)
      style        // Style object to be applied to row (to position it)
    }) {
    const requestPaneKey = `request-pane-${index}`
    return (
        <div key={key} style={style}>
          <RequestPane key={requestPaneKey} request={this.props.http.messages[index].request} response={this.props.http.messages[index].response} />
        </div>
    )
  }

  render () {
    const chipStyle = {
      width: '100%',
      paddingLeft: '3px',
      display: this.props.ui.displayFilter ? 'inline-block' : 'none'
    }

    return <div style={{height: '100%', width: '100%'}}>
      <ChipInput ref={(input) => { this.chipInput = input }} onChange={this.props.updateFilter} style={chipStyle} />
      <AutoSizer>
      {({ height, width }) => (
        <List rowCount={this.props.http.messages.length} width={width} height={height} rowHeight={() => 153} rowRenderer={this.rowRenderer} />
      )}
      </AutoSizer>
      </div>
  }
}
/* eslint-enable react/jsx-indent */

RequestContainer.propTypes = {
  http: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, { updateFilter })(RequestContainer)
