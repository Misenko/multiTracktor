import React, {useState, useEffect} from 'react'
import {View, TouchableOpacity, TextInput, Text} from 'react-native'
import {useDispatch} from 'react-redux'
import {useNavigation} from 'react-navigation-hooks'
import DateTimePicker from 'react-native-modal-datetime-picker'
import Realm from 'realm'
import uuid from 'uuid'
import {format, getTime} from 'date-fns'

import {MAIN} from '../navigation/routes'
import {POSITION_RADIUS} from '../constants'
import {schemas, NAMES} from '../database/schemas'
import {coordinatesSelected} from '../redux/actions'
import {distanceFromNearest} from '../helpers/maps'

import style from './NewEventButton.style'

const NewEventButton = ({coordinates, placeId, placeName}) => {
  const {navigate, goBack} = useNavigation()
  const [moreOptions, setMoreOptions] = useState(false)
  const [dateTimePicker, setDateTimePicker] = useState(false)
  const [newPlaceName, setNewPlaceName] = useState('')
  const [date, setDate] = useState(new Date())
  const [place, setPlace] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    const loadPlace = async () => {
      const realm = await Realm.open({schema: schemas})
      setPlace(realm.objectForPrimaryKey(NAMES.PLACE, placeId))
    }

    if (placeId) {
      loadPlace()
    }
  }, [placeId])

  const onPress = async () => {
    const realm = await Realm.open({schema: schemas})
    realm.write(() => {
      const event = realm.create(NAMES.EVENT, {
        id: uuid(),
        timestamp: getTime(date),
      })

      if (!place) {
        const newPlace = realm.create(NAMES.PLACE, {
          id: uuid(),
          name: newPlaceName,
        })

        const position = realm.create(NAMES.POSITION, {
          id: uuid(),
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        })

        position.place = newPlace
        event.place = newPlace
        return
      }

      if (coordinates) {
        const distance = distanceFromNearest(coordinates, place.positions)
        if (distance > POSITION_RADIUS) {
          const position = realm.create(NAMES.POSITION, {
            id: uuid(),
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          })

          position.place = place
        }
      }
      event.place = place
    })

    dispatch(coordinatesSelected(null))
    goBack()
  }

  const toggleMoreOptions = () => setMoreOptions(!moreOptions)
  const toggleDateTimePicker = () => setDateTimePicker(!dateTimePicker)
  const selectDateTime = (date) => {
    setDate(date)
    toggleDateTimePicker()
  }

  return (

    <View style={style.wrapper}>
      <View style={style.inputWrapper}>
        <TouchableOpacity onPress={onPress}>
          {
            placeId
              ? <Text>{placeName}</Text>
              : <TextInput
                placeholder={'Place'}
                value={newPlaceName}
                onChangeText={setNewPlaceName}
                style={style.input}
              />
          }
          {
            moreOptions &&
            <View>
              <TouchableOpacity onPress={toggleDateTimePicker}>
                <Text>{format(date, 'dd.MM.yyyy HH:mm')}</Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={dateTimePicker}
                onConfirm={selectDateTime}
                onCancel={toggleDateTimePicker}
                date={date}
                mode={'datetime'}
                is24Hour
              />
              {
                !placeId &&
                <TouchableOpacity onPress={() => navigate(MAIN.SELECT_PLACE)}>
                  <Text>Select place</Text>
                </TouchableOpacity>
              }
            </View>
          }
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={toggleMoreOptions}
        style={style.moreOptionsButton}
      />
    </View>
  )
}

export default NewEventButton
