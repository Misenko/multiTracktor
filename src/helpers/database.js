import uuid from 'uuid'
import {getTime} from 'date-fns'
import Realm from 'realm'

import {POSITION_RADIUS} from '../constants'
import {schemas, NAMES} from '../database/schemas'
import {distanceFromNearest} from '../helpers/maps'

const openDB = () => {
  return Realm.open({schema: schemas})
}

const writeEvent = (db, date) => {
  return db.create(NAMES.EVENT, {
    id: uuid(),
    timestamp: getTime(date),
  })
}

const writePlace = (db, placeName) => {
  return db.create(NAMES.PLACE, {
    id: uuid(),
    name: placeName,
  })
}

const writePosition = (db, coordinates) => {
  return db.create(NAMES.POSITION, {
    id: uuid(),
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  })
}

export const getEvent = async (eventId) => {
  const db = await openDB()
  return db.objectForPrimaryKey(NAMES.EVENT, eventId)
}

export const getEvents = async () => {
  const db = await openDB()
  return db.objects(NAMES.EVENT)
}

export const saveEvent = async (date, coordinates, placeName) => {
  const db = await openDB()
  db.write(() => {
    const event = writeEvent(db, date)
    const place = writePlace(db, placeName)
    const position = writePosition(db, coordinates)

    position.place = place
    event.place = place
  })
}

export const saveEventWithPlace = async (date, coordinates, place) => {
  const db = await openDB()
  db.write(() => {
    const event = writeEvent(db, date)

    if (coordinates) {
      const distance = distanceFromNearest(coordinates, place.positions)
      if (distance > POSITION_RADIUS) {
        const position = writePosition(db, coordinates)
        position.place = place
      }
    }
    event.place = place
  })
}

export const getPlace = async (placeId) => {
  const db = await openDB()
  return db.objectForPrimaryKey(NAMES.PLACE, placeId)
}

export const getPlaces = async () => {
  const db = await openDB()
  return db.objects(NAMES.PLACE)
}
