# react-native-panrespondertouchview
React-Native PanResponder unite Animated ,Support iOS Android;

```
npm install react-native-panrespondertouchview --save

```

![image](https://github.com/CJELLYS/image/blob/master/download.gif?raw=true)
![image](https://github.com/CJELLYS/image/blob/master/downloadios.gif?raw=true)

## use

```
import {PanResponderTouchView}  from "react-native-panrespondertouchview"

onNarrowA(index){
    alert("点击了第"+index+"张图片");
    this.refs.PanResponderTouchView.onNarrowView();
 
  }

  subView(){
    return <View style={{ flex: 1, }}>
      <View style={{ width: CIRCLE_SIZEMax, height: CIRCLE_SIZEMax / 2, justifyContent: 'space-around', flexDirection: 'row' }} >
        <TouchableOpacity onPress={() => this.onNarrowA(1)} activeOpacity={1} style={{ width: CIRCLE_SIZEMax / 2, height: CIRCLE_SIZEMax / 2, }} >
          <Image source={require('./app/images/antivirus_scanner.png')} style={{ width: CIRCLE_SIZEMax / 2, height: CIRCLE_SIZEMax / 2 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.onNarrowA(2)} activeOpacity={1} style={{ width: CIRCLE_SIZEMax / 2, height: CIRCLE_SIZEMax / 2, }} >
          <Image source={require('./app/images/iris_scan.png')} style={{ width: CIRCLE_SIZEMax / 2, height: CIRCLE_SIZEMax / 2 }} />
        </TouchableOpacity>
      </View>
      <View style={{ width: CIRCLE_SIZEMax, height: CIRCLE_SIZEMax / 2, justifyContent: 'space-around', flexDirection: 'row' }} >
        <TouchableOpacity onPress={() => this.onNarrowA(3)} activeOpacity={1} style={{ width: CIRCLE_SIZEMax / 2, height: CIRCLE_SIZEMax / 2, }} >
          <Image source={require('./app/images/iris_scan.png')} style={{ width: CIRCLE_SIZEMax / 2, height: CIRCLE_SIZEMax / 2 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.onNarrowA(4)} activeOpacity={1} style={{ width: CIRCLE_SIZEMax / 2, height: CIRCLE_SIZEMax / 2, }}>
          <Image source={require('./app/images/bullet_camera.png')} style={{ width: CIRCLE_SIZEMax / 2, height: CIRCLE_SIZEMax / 2 }} />
        </TouchableOpacity>
      </View>
    </View> 
  }

  _onTouchEnd(event){
     this.refs.PanResponderTouchView.onTouchEnd(event)
  }


  render() {

    return (
      <View style={styles.container} onTouchEnd={(event) => this._onTouchEnd(event)}>
        <PanResponderTouchView ref={"PanResponderTouchView"} subView={this.subView()} defaultPosition={{ x: 2, y: (ScreenHeight / 2.0) }}/>
      </View>
    );
  }
  
  
  PanResponderTouchView.defaultProps = {
  superOnonNarrow: function superOnonNarrow() { },
  narrowTimer: 4000,
  highlightBackColor: '#666666',
  unHighlightBackColor: '#222222',
  defaultPosition: { x: 2, y: (ScreenHeight / 2.0) },
  CIRCLE_SIZE:60,
  CIRCLE_SIZEMax:296,
  boundaryValue:2
};
  ```
