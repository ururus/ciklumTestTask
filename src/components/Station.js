import React from "react";
import {Stage, Group, Layer, Rect, Text, Line,} from 'react-konva';
import Konva from 'konva';
import {Grid, Col, Row,Button} from 'react-bootstrap';
import ReactInterval from 'react-interval';

export default class Station extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      height: 500,
      pointsQuantity: 100,
      linePoints: [],
      max: 0,
      color:Konva.Util.getRandomColor(),
      interval: Math.floor(Math.random() * (400 - 100)) + 100
    }
  }

  setLinePoints() {
    let points = this.props.points
    let linePoints = []
    let positiveMax = Math.max.apply(null, points)
    let negativeMax = Math.min.apply(null, points)
    let max = positiveMax > Math.abs(negativeMax) ?
     positiveMax : Math.abs(negativeMax)

    let rx = this.props.width / this.state.pointsQuantity
    let ry = (this.state.height - 20) / 2 / max


    for (let i = 0; i < points.length; i++) {
      let x = i * rx
      let y = (this.state.height / 2) - (points[i] * ry)
      linePoints.push(x, y)
    }

    this.setState({
      linePoints: linePoints,
      max: max
    })

    this.props.setStationMinMax(this.props.name,positiveMax,negativeMax)

  }


  updateStation(){
   this.props.updateData(this.props.name, this.props.time)
  }

  componentDidMount() {
    this.setLinePoints()
    var reqInterval = setInterval(this.requestData, this.state.reqTime);
    this.setState({request: reqInterval});
  }

  componentDidUpdate(prevProps,prevState) {
    if (!prevProps.points.equals(this.props.points)) {
      this.setLinePoints()
    }
    if (prevState.timeStamp != this.state.timeStamp){
      this.updateStation()
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.request);
  }

  render() {
    return <Col xs={12}>
      <h2>{this.props.name}</h2>
      <Stage width={this.props.width} height={this.state.height}>
        <Layer>
            <Group>
              <Line
                points={[0, this.state.height / 2, this.props.width, this.state.height / 2]}
                stroke="grey"
                strokeWidth={1}/>
            </Group>
          <Group>
            <Line
              points={[1, 0, 1, this.state.height]}
              stroke="grey"
              strokeWidth={1}/>
          </Group>
        </Layer>
        <Layer>
          <Line
            points={this.state.linePoints}
            stroke={this.state.color}
            strokeWidth={3}
            tension={0.2}/>
        </Layer>
        <Layer>
            <Group>
              <Text
                text={this.state.max}
                fontSize={18}
                x={10}
                y={0}
              />
              <Text
                  text={this.props.points[this.props.points.length-1]}
                  fontSize={30}
                  fill="red"
                  opacity={0.4}
                  x={this.props.width/2-50}
                  y={20}
              />
              <Text
                text={this.state.max * -1}
                fontSize={18}
                x={10}
                y={this.state.height-20}
              />
            </Group>
        </Layer>
        {!this.props.enabled && <Layer>
          <Rect
            x={0}
            y={0}
            width={this.props.width}
            height={this.state.height}
            fill={"grey"}
            opacity={0.5}
            shadowBlur={5}
            onClick={this.handleClick}
          />
          <Text
            text="OFFLINE"
            fontSize={60}
            fill={'red'}
            opacity={0.5}
            x={this.props.width/2-120}
            y={this.state.height/2-50}
          />
        </Layer>}
      </Stage>

      <ReactInterval timeout={this.state.interval} enabled={true}
                     callback={this.updateStation.bind(this)} />

    </Col>
  }
}
