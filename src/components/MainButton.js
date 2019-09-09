import React, {useState} from 'react'
import {TouchableOpacity, Text, View} from 'react-native'

import {GaugeProgress} from 'react-native-simple-gauge'

import styles, {buttonSize, gaugeWidth} from './MainButton.style'

const percentage = (f, s) => f / s * 100 || 0

const MainButton = () => {
  const all = 1
  const [visited, setVisited] = useState(0)

  return (
     <View style={styles.mainButton}>
       <GaugeProgress
         size={buttonSize + gaugeWidth * 2}
         width={gaugeWidth}
         fill={percentage(visited, all)}
         cropDegree={180}
         tintColor="#4682b4"
         backgroundColor="#b0c4de">
          <TouchableOpacity
            style={styles.innerButton}
            onPress={() => {}}>
            <Text>Main Button</Text>
          </TouchableOpacity>
        </GaugeProgress>
      </View>
  )
}

export default MainButton