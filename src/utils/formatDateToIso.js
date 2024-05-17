function FormatDateToISO(indonesianDate) {
  const months = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    Mei: '05',
    Jun: '06',
    Jul: '07',
    Agu: '08',
    Sep: '09',
    Okt: '10',
    Nov: '11',
    Des: '12',
  };

  // Split the input date string
  const dateParts = indonesianDate.split(' ');
  const day = dateParts[0];
  const month = months[dateParts[1]];
  const year = dateParts[2];

  // Format the date in "YYYY-MM-DD"
  const isoDate = `${year}-${month}-${day.padStart(2, '0')}`;

  return isoDate;
}

export default FormatDateToISO;

// Example usage
// const indonesianDate = '17 Mei 2024';
// const isoDate = convertDateToISO(indonesianDate);
// console.log(isoDate); // Output: 2024-05-17
