import React from 'react'
import PropTypes from 'prop-types'
import RequestPane from './request-pane'
import { connect } from 'react-redux'
import { List, AutoSizer } from 'react-virtualized'

/* eslint-disable react/jsx-indent */
const RequestContainer = ({ requests }) => {
  function rowRenderer ({
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    style        // Style object to be applied to row (to position it)
  }) {
    return (
      <div key={key} style={style}>
        <RequestPane key={`request-pane-${index}`} request={requests[index].request} response={requests[index].response} />
      </div>
    )
  }

  return <div style={{height: '100%', width: '100%'}}>
            <AutoSizer>
              {({ height, width }) => (
                <List rowCount={requests.length} width={width} height={height} rowHeight={() => 113} rowRenderer={rowRenderer} />
              )}
            </AutoSizer>
         </div>
}
/* eslint-enable react/jsx-indent */

RequestContainer.propTypes = {
  requests: PropTypes.array.isRequired
}

const mapStateToProps = ({ requests, responses }) => ({ requests, responses })

export default connect(mapStateToProps)(RequestContainer)
