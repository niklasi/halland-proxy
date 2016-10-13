
const transformHeaders = (headers) => {
  return Object.keys(headers).map(header => {
    return {key: header, value: headers[header]}
  })
}

const headerMapper = (header, index) => <li key={`${header.key}-${index}`}>{`${header.key}: ${header.value}`}</li>

/* eslint-disable react/jsx-indent */
module.exports = ({ title, headers }) => <div>
                                        <h3>{title}</h3>
                                        <ul>
                                          {transformHeaders(headers).map(headerMapper)}
                                        </ul>
                                      </div>
/* eslint-enable react/jsx-indent */
