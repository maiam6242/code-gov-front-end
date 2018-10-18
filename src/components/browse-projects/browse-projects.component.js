import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import FilterBox from 'components/filter-box'
import RepoCard from 'components/repo-card'
import { refreshView } from 'utils'


export default class BrowseProjects extends React.Component {

  componentDidMount () {
    refreshView()
    if (!this.props.filterData) this.props.saveFilterData()
    this.usageTypes = [
      {"name":"Open Source","value":"openSource"},
      {"name":"Government-Wide Reuse","value":"governmentWideReuse"}
    ]
  }

  get repoCounter() {
    const { total } = this.props
    let textContent
    if (total === 0) {
      textContent = 'No Repositories'
    } else if (total === 1) {
      textContent = '1 Repository'
    } else if (total >= 2) {
      textContent = `${total} Repositories`
    } else {
      textContent = 'Loading Repositories'
    }
    return <h3 className="repos-count width-three-quarters">{textContent}</h3>
  }

  get filterTags() {
    if (this.state.filterTags) {
      return (
        <div className="filter-tags">
          {this.state.filterTags.map(tag => {
            <div className="filter-tag" onClick={() => this.removeFilterTag(tag)}>
              <div className="filter-tag-title">{tag.name}</div>
            </div>
          })}
        </div>
      )
    }
  }

  get reposContainer() {
    const filteredResults = this.props.filteredResults
    console.log("starting reposContainers with filteredResults:", filteredResults)

    if (filteredResults) {
      return (
        <div className="repos-container">
          <ul className="repos-list repos-list--infinite-scrolled">
          {filteredResults.slice(0, 50).map(repo => <RepoCard key={repo.repoID} repo={repo}/>)}
          </ul>
          <ul className="repos-list repos-list--paged">
          </ul>
        </div>
      )
    }
  }

  onFilterBoxChange(category, event) {
    if (event.target.tagName.toLowerCase() === 'filter-box') {
      const values = event.target.values

      this.scrollToTopOfResults()

      const filters = {
        agencies: this.props.agencies,
        languages: this.props.languages,
        licenses: this.props.licenses,
        usageTypes: this.props.usageTypes
      }

      filters[category] = values

      console.warn("cat val:", category, values)
      console.warn("filters:", filters)
      this.props.onFilterBoxChange(filters)
    }
  }

  scrollToTopOfResults() {
    this.refs.crumbs.scrollIntoView()
    window.scrollBy(0, -100)
  }

  removeFilterTag(selectedTag) {
    console.log("starting removeFilterTag")
    const filterTags = this.state.filterTags.filter(tag => tag !== selectedTag);
    this.setState({ filterTags })
  }

  render() {
    return (
      <div className="search-results-content">
        <simple-banner image={this.props.backgroundImage} title='Browse Projects' />
        <div className="indented" ref="crumbs">
          <ul className="breadcrumbs">
            <li><Link to="/">Home</Link></li>
            <li>Browse Projects</li>
          </ul>
        </div>
        <div className="search-results-header">
            <div className="indented">
              <div className="width-quarter"></div>
              {this.repoCounter}
            </div>
          </div>
        <div className="indented">
          <div id="filter-boxes-section">
            <h2>Filter</h2>

            {Array.isArray(this.props.languages) && this.props.languages.length > 1 && (
            <FilterBox title="Language" options={this.props.languages} onChange={event => this.onFilterBoxChange('languages', event)} />
            )}

            {Array.isArray(this.props.agencies) && this.props.agencies.length > 1 && (
            <FilterBox title="Federal Agency" options={this.props.agencies} onChange={event => this.onFilterBoxChange('agencies', event)} />
            )}

            {Array.isArray(this.props.licenses) && this.props.licenses.length > 1 && (
            <FilterBox title="License" options={this.props.licenses} onChange={event => this.onFilterBoxChange('licenses', event)} />
            )}

            {this.usageTypes && (
            <FilterBox title="Usage Type" options={this.usageTypes} onChange={event => this.onFilterBoxChange('usageTypes', event)} />
            )}

          </div>
          <div id="filter-results-section">
            <div className="sort-section">
              <h2>
                <span>Sort by</span>
                <select onChange={this.onSortSelectionChange}>
                  <option value="Data Quality">Data Quality</option>
                  <option value="A-Z">A-Z</option>
                  <option value="Last Updated">Last Updated</option>
                </select>
              </h2>
            </div>
            <div className="repo-list">
              {this.reposContainer}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
