function FormatDateTime(dates) {
  // Parse the date string to a Date object
  const dateObj = new Date(dates);

  // Convert to Indonesia timezone
  const optionsDate = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Jakarta',
  };
  const optionsTime = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  };

  // Format date and time in Indonesia timezone
  const realDate = dateObj.toLocaleDateString('id-ID', optionsDate);
  const realTime = dateObj.toLocaleTimeString('id-ID', optionsTime);

  return {realDate, realTime};
}

export default FormatDateTime;
