import React from 'react'
import {View, TouchableOpacity, Text} from 'react-native'
import {useNavigation} from 'react-navigation-hooks'

import {MAIN} from '../navigation/routes'
import WeekOverview from './WeekOverview'
import MainButton from './MainButton'
import styles from './MainScreen.style'

const MainScreen = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.mainView}>
      <View style={styles.weekOverview}>
        <WeekOverview />
      </View>
      <View style={styles.mainButton}>
        <MainButton />
      </View>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate(MAIN.SETTINGS)}>
          <Text>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default MainScreen
