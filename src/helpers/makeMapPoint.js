// this helper function should return an array of array containing [lon, lat] for a point on a map.

export function makeMapPoints(checkinArr) {
  const coordinates = checkinArr.map(checkin => {
    return [parseFloat(checkin.longitude), parseFloat(checkin.latitude)];
  });
  return coordinates;
}
