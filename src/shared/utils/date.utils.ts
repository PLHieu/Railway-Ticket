export function getDateTimeString(datetime_obj) {
  return (
    datetime_obj.getFullYear() +
    '-' +
    (datetime_obj.getMonth() + 1) +
    '-' +
    datetime_obj.getDate() +
    ' ' +
    datetime_obj.getHours() +
    ':' +
    datetime_obj.getMinutes() +
    ':' +
    datetime_obj.getSeconds()
  );
}

export function getDateString(datetime_obj) {
  return (
    datetime_obj.getFullYear() +
    '-' +
    (datetime_obj.getMonth() + 1) +
    '-' +
    datetime_obj.getDate()
  );
}
