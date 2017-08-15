/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  Animated,
  Platform
} from 'react-native';

let ScreenHeight = Number(Dimensions.get('window').height);
let ScreenWidth = Number(Dimensions.get('window').width);

export class PanResponderTouchView extends Component {
  constructor(props) {
    super(props);
    this.CIRCLE_SIZE = this.props.CIRCLE_SIZE;
    this.CIRCLE_SIZEMax = this.props.CIRCLE_SIZEMax;
    this.boundaryValue = this.props.boundaryValue;
    this.scaleGap = (ScreenWidth - this.CIRCLE_SIZE) / 2.0

    this._circleStyles = {};
    this._panResponder = {};
    this._previousLeft = this.props.defaultPosition.x;
    this._previousTop = this.props.defaultPosition.y;
    this.moveLayoutEvent = null;
    this.startMoveEvent = null;
    this.endMoveEvent = null;
    
    this.startMoveGestureState = null;
    this.endMoveGestureState = null;
    this.zoomBeforeLayout = { x: 2, y: ScreenHeight / 2.0 };//点击放大前坐标x,y
    this.onScaleNumber = true;//点击缩放次数
    this.state = {
      moveAnimatedXY: new Animated.ValueXY(this.props.defaultPosition),
      moveAnimatedW: new Animated.Value(this.CIRCLE_SIZE),
      moveAnimatedH: new Animated.Value(this.CIRCLE_SIZE),
      opacityAnimated: new Animated.Value(0.5),
      transformScale: 0,
    }
  }

  componentWillMount() {
    this._circleStyles = {
      style: {
        left: this.boundaryValue,
        top: ScreenHeight / 2.0,
        backgroundColor: 'green',
        opacity: 0.7
      }
    };
    this._panResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => this.onScaleNumber,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => this.onScaleNumber,
      onMoveShouldSetPanResponder: (evt, gestureState) => this.onScaleNumber,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.onScaleNumber,

      onPanResponderGrant: (evt, gestureState) => {
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
        // gestureState.{x,y} 现在会被设置为0
        this.startMoveEvent = evt.nativeEvent;
        this.startMoveGestureState = gestureState

        this._highlight();
      },
      onPanResponderMove: (evt, gestureState) => {
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        if (this.onScaleNumber) {
          Animated.timing(
            this.state.moveAnimatedXY,
            {
              toValue: { x: this._previousLeft + gestureState.dx, y: Number(this._previousTop) + Number(gestureState.dy) },
              duration: 1
            }
          ).start();
        }
        this._updateNativeStyles();
      },

      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        // 一般来说这意味着一个手势操作已经成功完成。
        this.endMoveEvent = evt.nativeEvent;
        this.endMoveGestureState = gestureState
        let timer = this.endMoveEvent.timestamp - this.startMoveEvent.timestamp
        if (timer <= 100) {
          Animated.timing(
            this.state.moveAnimatedXY,
            {
              toValue: { x: (ScreenWidth -this.CIRCLE_SIZEMax) / 2.0, y: (ScreenHeight -this.CIRCLE_SIZEMax) / 2.0 },
              duration: 200
            }
          ).start();
          Animated.timing(
            this.state.moveAnimatedW,
            {
              toValue: this.CIRCLE_SIZEMax,
              duration: 200
            }
          ).start();
          Animated.timing(
            this.state.moveAnimatedH,
            {
              toValue: this.CIRCLE_SIZEMax,
              duration: 200
            }
          ).start();
          this.setState({
            transformScale: 1,
          })
          this.onScaleNumber = false;

          this.timerScale && clearTimeout(this.timerScale);
          this.timerScale = setTimeout(() => {
            this.onNarrow()
          }, this.props.narrowTimer)
        } else {
          let yNumber = this.moveLayoutEvent.layout.y
          if (this.moveLayoutEvent.layout.y <= 0) {
            yNumber = 2;
          } else if (this.moveLayoutEvent.layout.y + this.CIRCLE_SIZE >= (Platform.OS == 'ios'? ScreenHeight:ScreenHeight-20)){
            yNumber = Platform.OS == 'ios'?(ScreenHeight - this.CIRCLE_SIZE - 2):(ScreenHeight - this.CIRCLE_SIZE - 20)
          }

          if (this.onScaleNumber) {
            if ((this.moveLayoutEvent.layout.x) < ScreenWidth / 2.0) {
              Animated.timing(
                this.state.moveAnimatedXY,
                {
                  toValue: { x: this.boundaryValue, y: Number(yNumber) },
                  duration: 200
                }
              ).start();
              this._previousLeft = this.boundaryValue;
            } else {
              Animated.timing(
                this.state.moveAnimatedXY,
                {
                  toValue: { x: ScreenWidth - 60 - this.boundaryValue, y: Number(yNumber) },
                  duration: 200
                }
              ).start();
              this._previousLeft = ScreenWidth - 60 - this.boundaryValue;
            }
            this.zoomBeforeLayout = { x: this._previousLeft, y: (yNumber) }
          }

          this._previousTop = (yNumber);
          this.unTimer && clearTimeout(this.unTimer);
          this.unTimer = setTimeout(() => {
            this._unHighlight();
          }, this.props.narrowTimer);
        }

        this._updateNativeStyles();
      },

      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
        this._handlePanResponderEnd(evt, gestureState);
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
        // 默认返回true。目前暂时只支持android。
        return true;
      },
    });
  }

  _unHighlight() {
    console.log("====>diang");
    // this._circleStyles.style.backgroundColor = '#BBBBBB';
    this._circleStyles.style = {
      backgroundColor: this.props.unHighlightBackColor
    }
    Animated.timing(
      this.state.opacityAnimated,
      {
        toValue: 0.5,
        duration: 200
      }
    ).start();
    this._updateNativeStyles();
  }

  _highlight() {
    this._circleStyles.style = {
      backgroundColor: this.props.highlightBackColor
    }
    Animated.timing(
      this.state.opacityAnimated,
      {
        toValue: 0.7,
        duration: 200
      }
    ).start();
    this._updateNativeStyles();
  }
  _updateNativeStyles() {
    this.circle && this.circle.setNativeProps(this._circleStyles);
  }

  _handlePanResponderEnd(e: Object, gestureState: Object) {

    this._previousLeft = 5;
    this._previousTop += gestureState.dy;
  }

  onNarrow() {
    Animated.timing(
      this.state.moveAnimatedXY,
      {
        toValue: { x: this.zoomBeforeLayout.x, y: this.zoomBeforeLayout.y },
        duration: 200
      }
    ).start();
    Animated.timing(
      this.state.moveAnimatedW,
      {
        toValue: this.CIRCLE_SIZE,
        duration: 200
      }
    ).start();
    Animated.timing(
      this.state.moveAnimatedH,
      {
        toValue: this.CIRCLE_SIZE,
        duration: 200
      }
    ).start();
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({
        transformScale: 0,
      })
    }, 150)
    this.onScaleNumber = true;
    this.unTimer && clearTimeout(this.unTimer);
    this.unTimer = setTimeout(() => {
      this._unHighlight();
    }, this.props.narrowTimer);
    this.props.superOnonNarrow();
  }

  onNarrowView() {
    this.timerScale && clearTimeout(this.timerScale);
    this.onNarrow();
  }

  _onLayoutMoveView(event) {
    this.moveLayoutEvent = event.nativeEvent;
  }

  subView() {
    if (this.state.transformScale == 0) {

    } else {
      return this.props.subView;
    }
  }

  onTouchEnd(event) {
    let xBool = (event.nativeEvent.pageX >= this.moveLayoutEvent.layout.x && event.nativeEvent.pageX <= (this.moveLayoutEvent.layout.x + this.moveLayoutEvent.layout.width)) ? true : false;
    let yBool = (event.nativeEvent.pageY >= this.moveLayoutEvent.layout.y && event.nativeEvent.pageY <= (this.moveLayoutEvent.layout.y + this.moveLayoutEvent.layout.width)) ? true : false;
    if (xBool && yBool) {
    } else {
      this.onNarrow()
    }
  }



  render() {

    return (
      <Animated.View
        ref={(circle) => {
          this.circle = circle;
        }}
        onLayout={(event) => this._onLayoutMoveView(event)}
        style={[styles.circle, { backgroundColor: this.props.unHighlightBackColor, opacity: this.state.opacityAnimated, width: this.state.moveAnimatedW, height: this.state.moveAnimatedH, overflow: "hidden" }, this.state.moveAnimatedXY.getLayout()]}
        {...this._panResponder.panHandlers}
      >
        <TouchableOpacity onPress={() => this.onNarrow()} style={{ flex: 1 }} activeOpacity={1}>
          {this.subView()}
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

PanResponderTouchView.defaultProps = {
  superOnonNarrow: function superOnonNarrow() { },
  narrowTimer: 4000,
  highlightBackColor: '#222222',
  unHighlightBackColor: '#666666',
  defaultPosition: { x: 2, y: (ScreenHeight / 2.0) },
  CIRCLE_SIZE:60,
  CIRCLE_SIZEMax:296,
  boundaryValue:2
};

const styles = StyleSheet.create({
  circle: {
    borderRadius: 16,
    position: 'absolute',
  },
});


