import React from "react";
import ReactDOM from "react-dom";
import {Stage, Group, Layer, Rect, Text, Line} from 'react-konva';
import Konva from 'konva';
import {Grid, Col, Row, FormGroup, FormControl} from 'react-bootstrap';
import actions from '../redux/actions';
import {connect} from 'react-redux';
import Station from './Station'


if (Array.prototype.equals)
  console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
Array.prototype.equals = function (array) {
  if (!array)
    return false;
  if (this.length != array.length)
    return false;

  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] instanceof Array && array[i] instanceof Array) {
      if (!this[i].equals(array[i]))
        return false;
    }
    else if (this[i] != array[i]) {
      return false;
    }
  }
  return true;
}


class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      stationList: [],
      sort: null
    }
  }

  componentDidMount() {
    this.props.dispatch(actions.initialFetch())
    let width = ReactDOM.findDOMNode(this.itemsWrapper).getBoundingClientRect().width
    this.setState({
      width: width
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (!Object.keys(this.props.interplanetaryStations.stations).equals(Object.keys(prevProps.interplanetaryStations.stations))) {
      this.getStationList()
    }
  }

  updateData(name, time) {
    this.props.dispatch(actions.stationFetch(this.props.interplanetaryStations.clientKey, name, time))
  }

  getStationList() {
    let stationList = []
    Object.keys(this.props.interplanetaryStations.stations).map(station => {
      stationList.push({name: station, max: 0})
    })
    this.setState({
      stationList: stationList
    })
  }

  setStationMax(station, max) {
    let editedStationList = this.state.stationList
    for (let i = 0; i < editedStationList.length; i++) {
      if (editedStationList[i].name == station) {
        editedStationList[i].max = max
      }
    }
    if (this.state.sort) {
      editedStationList = this.sortList(editedStationList)
    }

    this.setState({
      stationList: editedStationList
    })
  }

  sortList(list) {
    console.log(this.state.sort)
    list.sort((a, b) => {
      return a.max - b.max;
    });
    if (this.state.sort == 'asc') {
      list.reverse()
    }
    return list
  }


  filterData(event) {
    if (event.target.value.length > 0) {
      let filteredList = this.state.stationList.filter(station => {
        return station.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1;
      })
      this.setState({
        stationList: filteredList,
      });
    } else {
      this.getStationList()
    }
  }

  sortData(event) {
    this.setState({
      sort: event.target.value,
    })
  }


  render() {
    let {interplanetaryStations} = this.props
    return <Grid>
      <Row ref={(c) => {
        this.itemsWrapper = c
      } }>

        <Col xs={12} style={{margin: "20px 0"}}>
          <Row>
            <Col lg={6} md={8} xs={10}>
              <FormGroup>
                <FormControl
                  type="text"
                  value={this.state.value}
                  className="input__black"
                  placeholder="search station..."
                  onChange={this.filterData.bind(this)}
                  style={{borderRadius: 0, borderColor: 'black', fontSize: '1.4em',height:46}}
                />
              </FormGroup>
            </Col>
            <Col xs={2} className="pull-right">
              <FormControl componentClass="select"
                           placeholder="сортировать"
                           inputRef={(ref) => {
                             this.type = ref;
                           }}
                           onChange={this.sortData.bind(this)}
                           style={{borderRadius: 0, borderColor: 'black', fontSize: '1.1em',height:46}}
              >
                <option value={null}>не сортировать</option>
                <option value={'asc'}>наибольшая температура</option>
                <option value={'desc'}>наменьшая температура</option>
              </FormControl></Col>
          </Row>
        </Col>

        {this.state.stationList.map((station) => {
          return <Station enabled={interplanetaryStations.stations[station.name].enabled}
                          points={interplanetaryStations.stations[station.name].points}
                          time={interplanetaryStations.stations[station.name].time}
                          width={this.state.width}
                          key={station.name}
                          name={station.name}
                          updateData={this.updateData.bind(this)}
                          setStationMax={this.setStationMax.bind(this)}
          />
        })}

      </Row>


    </Grid>
  }
}


export default connect((state) => state)(App)
