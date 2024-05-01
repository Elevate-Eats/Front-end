function FormatDateTime(dates) {
  const splitDateTime = dates.split('T');
  const date = splitDateTime[0];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];
  const dateParts = date.split('-');
  const day = parseInt(dateParts[2]);
  const monthIdx = parseInt(dateParts[1]) - 1;
  const month = months[monthIdx];
  const year = parseInt(dateParts[0]);
  const time = splitDateTime[1].split('.')[0];
  const timeParts = time.split(':');
  const hour = parseInt(timeParts[0]);
  const minute = parseInt(timeParts[1]);
  const sec = parseInt(timeParts[2]);
  const dateObj = new Date();
  dateObj.setUTCHours(hour);
  dateObj.setUTCMinutes(minute);
  dateObj.setUTCSeconds(sec);
  const realDate = `${day} ${month} ${year}`;
  const realTime = dateObj.toLocaleTimeString('en-US', {hour12: false});
  return {realDate, realTime};
}

export default FormatDateTime;
