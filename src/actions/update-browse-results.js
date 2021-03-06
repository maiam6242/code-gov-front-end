import { UPDATE_BROWSE_RESULTS } from 'constants/actions'
import { getFilterValuesFromParamsByCategory } from 'utils/other'
import client from 'api-client'

export default function (params) {
  return async dispatch => {
    const options = {}
    if (params.size) options.size = params.size
    if (params.sort) options.sort = params.sort
    if (params.page) options.page = params.page
    if (params.filters) {
      ['agencies', 'languages', 'licenses', 'usageTypes'].forEach(key => {
        options[key] = getFilterValuesFromParamsByCategory(params, key)
      })
    }
    console.log("filtersAsObject", options)
    const results = await client.repos(options)
    console.error("results from client.repos with filters", options, "is", results.repos.length)
    results.params = options
    dispatch({ type: UPDATE_BROWSE_RESULTS, results })
  }
}