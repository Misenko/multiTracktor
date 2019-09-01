import {createAppContainer} from 'react-navigation'
import {createMaterialTopTabNavigator} from 'react-navigation-tabs'
import {createStackNavigator} from 'react-navigation-stack'

import {ROOT, MAIN} from './routes'
import MainScreen from '../components/MainScreen'
import CalendarScreen from '../components/CalendarScreen'
import SettingsScreen from '../components/SettingsScreen'

const MainNavigator = createStackNavigator({
  [ROOT.MAIN]: {
    screen: MainScreen,
    navigationOptions: () => ({
      header: null}),
  },
  [MAIN.SETTINGS]: SettingsScreen,
})

const RootNavigator = createMaterialTopTabNavigator(
  {
    [ROOT.MAIN]: MainNavigator,
    [ROOT.CALENDAR]: CalendarScreen,
  },
  {
    tabBarComponent: () => null,
  }
)

const AppContainer = createAppContainer(RootNavigator)

export default AppContainer
