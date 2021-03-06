import {useEffect, useCallback} from 'react'
import {useDispatch} from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'

import {DEFAULT_SETTINGS, SETTINGS_KEYS} from '../constants'
import {settingsUpdated} from '../redux/actions'

export const useStoreSettings = () => {
  const dispatch = useDispatch()

  const storeSettings = useCallback((settings) => {
    const asyncStorageSave = async (settings) => {
      await AsyncStorage.multiSet(Object.entries(settings))
    }

    asyncStorageSave(settings)
    dispatch(settingsUpdated(settings))
  }, [dispatch])

  return storeSettings
}

export const useInitializeSettings = () => {
  const storeSettings = useStoreSettings()
  const dispatch = useDispatch()

  useEffect(() => {
    const asyncStorageLoad = async () => {
      const keys = await AsyncStorage.getAllKeys()
      const values = await AsyncStorage.multiGet(keys)
      dispatch(settingsUpdated(Object.fromEntries(values)))
    }

    AsyncStorage.getItem(SETTINGS_KEYS.RUNNED).then((item) => {
      if (!item) {
        storeSettings(DEFAULT_SETTINGS)
      } else {
        asyncStorageLoad()
      }
    })
  }, [dispatch, storeSettings])
}
