import React, { Component } from 'react';
import { Backend } from './DataManager';
import { Link } from 'react-router-dom';
import { LoadingAnim, BaseArgoView } from './UIElements';
import ReactTable from 'react-table';


const DefaultFilterComponent = ({filter, onChange, field}) => (
  <input 
    type='text'
    placeholder={'Search by ' + field}
    value={filter ? filter.value : ''}
    onChange={event => onChange(event.target.value)}
    style={{width: '100%'}}
  />
)

const DropdownFilterComponent = ({filter, onChange, data}) => (
  <select
    onChange={event => onChange(event.target.value)}
    style={{width: '100%'}}
    value={filter ? filter.value : 'all'}
  >
    <option key={0} value=''>Show all</option>
    {
      data.map((name, i) => 
        <option key={i + 1} value={name}>{name}</option>
      )
    }
  </select>
)


export class MetricList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      list_metric: null,
      list_tags: null,
      list_groups:null
    }

    this.location = props.location;
    this.backend = new Backend();
  }

  componentDidMount() {
    this.setState({loading: true});

    Promise.all([this.backend.fetchAllMetric(),
      this.backend.fetchAllGroups(),
      this.backend.fetchTags()
    ]).then(([metrics, groups, tags]) =>
          this.setState({
            list_metric: metrics,
            list_tags: tags,
            list_groups: groups['metrics'],
            loading: false, 
            search: ''
          }));
  }

  render() {
    const columns = [
      {
        Header: 'Name',
        id: 'name',
        minWidth: 100,
        accessor: e =>
        <Link to={'/ui/metrics/' + e.name}>
          {e.name}
        </Link>,
        filterable: true,
        Filter: (
          <input 
            value={this.state.search}
            onChange={e => this.setState({search: e.target.value})}
            placeholder='Search by name'
            style={{width: '100%'}}
          />
        )
      },
      {
        Header: 'Tag',
        accessor: 'tag',
        minWidth: 30,
        Cell: row =>
          <div style={{textAlign: 'center'}}>
            {row.value}
          </div>,
        filterable: true,
        Filter: ({filter, onChange}) => (
        <DropdownFilterComponent
          filter={filter}
          onChange={onChange}
          data={this.state.list_tags}
        />
        )
      },
      {
        Header: 'Probe version',
        minWidth: 80,
        accessor: 'probeversion',
        Cell: row =>
          <div style={{textAlign: 'center'}}>
            {row.value}
          </div>,
        filterable: true,
        Filter: ({filter, onChange}) => (
          <DefaultFilterComponent 
            filter={filter}
            onChange={onChange}
            field='probe version'
          />
        )
      },
      {
        Header: 'Group',
        minWidth: 30,
        accessor: 'group',
        Cell: row =>
          <div style={{textAlign: 'center'}}>
            {row.value}
          </div>,
        filterable: true,
        Filter: ({filter, onChange}) => (
          <DropdownFilterComponent 
            filter={filter}
            onChange={onChange}
            data={this.state.list_groups}
          />
        )
      },
    ];

    var { loading, list_metric } = this.state;

    if (this.state.search) {
      list_metric = list_metric.filter(row =>
        row.name.toLowerCase().includes(this.state.search.toLowerCase())
      )
    }

    if (loading)
      return (<LoadingAnim />);

    else if (!loading && list_metric) {
      return (
        <BaseArgoView
          resourcename='metric'
          location={this.location}
          listview={true}>
            <ReactTable
              data={list_metric}
              columns={columns}
              className='-striped -highlight'
              defaultPageSize={20}
              defaultFilterMethod={(filter, row) =>
                row[filter.id] !== undefined ? String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase()) : true
              }
            />
          </BaseArgoView>
      )
    }
    else
      return null
  }
}
