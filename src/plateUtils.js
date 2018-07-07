import persianJs from 'persianjs';

// plate dictionaries ----------------------------------------------------------
const letter_coding_map = {
  A: '01',
  B: '02',
  P: '20',
  t: '03',
  J: '04',
  D: '05',
  S: '06',
  s: '07',
  E: '09',
  T: '08',
  G: '10',
  L: '11',
  M: '12',
  N: '13',
  V: '14',
  H: '15',
  Y: '16',
  Z: '19',
};

const letter_decoding_map_persian = {
  '01': 'الف',
  '02': 'ب',
  '20': 'پ',
  '03': 'ت',
  '04': 'ج',
  '05': 'د',
  '06': 'س',
  '07': 'ص',
  '08': 'ط',
  '09': 'ع',
  '10': 'ق',
  '11': 'ل',
  '12': 'م',
  '13': 'ن',
  '14': 'و',
  '15': 'ه',
  '16': 'ی',
  '19': 'ژ',
};

const letter_encoding_map_persian = {
  الف: '01',
  ب: '02',
  پ: '20',
  ت: '03',
  ج: '04',
  د: '05',
  س: '06',
  ص: '07',
  ط: '08',
  ع: '09',
  ق: '10',
  ل: '11',
  م: '12',
  ن: '13',
  و: '14',
  ه: '15',
  ی: '16',
  ژ: '19',
};

const plate_coding_map_persian = {
  ژ: '38',
  پ: '42',
  ع: '13',
  ت: '12',
  الف: '11',
};

const plate_coding_map = {
  Z: '38',
  P: '42',
  E: '13',
  t: '12',
  A: '11',
};

export const convertToNajaFormat = characters => {
  const twoDigit = characters[0] + characters[1];
  const threeDigit = characters[3] + characters[4] + characters[5];
  const letter = characters[2];
  let plateTypeCode = '';
  if (plate_coding_map_persian[letter])
    plateTypeCode = plate_coding_map_persian[letter];
  else plateTypeCode = '10';
  const iranCode = characters[6] + characters[7];
  const letterCode = letter_encoding_map_persian[letter];
  const plateCode = `${plateTypeCode}0${iranCode}00000000${letterCode}${twoDigit}${threeDigit}`;
  return plateCode;
};

export const convertTo8Digit = codedPlate => {
  const iranCode = codedPlate.substring(3, 5);
  const letter = letter_decoding_map_persian[codedPlate.substring(13, 15)];
  const twoDigit = codedPlate.substring(15, 17);
  const threeDigit = codedPlate.substring(17, 20);
  const characters = [];
  characters.push(twoDigit[0]);
  characters.push(twoDigit[1]);
  characters.push(letter);
  characters.push(threeDigit[0]);
  characters.push(threeDigit[1]);
  characters.push(threeDigit[2]);
  characters.push(iranCode[0]);
  characters.push(iranCode[1]);
  return characters;
};

export const correctDateTime = dateTime => {
  const date = dateTime.split(' ')[0];
  const time = dateTime.split(' ')[1];
  const dateSplitted = date.split('/');
  const dateSplittedYear = dateSplitted[0];
  const dateSplittedMonth =
    dateSplitted[1].length === 1 ? `0${dateSplitted[1]}` : dateSplitted[1];
  const dateSplittedDay =
    dateSplitted[2].length === 1 ? `0${dateSplitted[2]}` : dateSplitted[2];
  const timeSplitted = time.split(':');
  const timeSplittedHour =
    timeSplitted[0].length === 1 ? `0${timeSplitted[0]}` : timeSplitted[0];
  const timeSplittedMinute =
    timeSplitted[1].length === 1 ? `0${timeSplitted[1]}` : timeSplitted[1];
  return `${dateSplittedYear}/${dateSplittedMonth}/${dateSplittedDay} ${timeSplittedHour}:${timeSplittedMinute}`;
};

export const toEnglishCharacters = characters => {
  const newCharacters = [];
  for (let i = 0; i < characters.length; i++) {
    if (i !== 2) {
      newCharacters.push(persianJs(characters[i]).toEnglishNumber().toString());
    } else {
      newCharacters.push(characters[i]);
    }
  }
  return newCharacters;
};

export const toPersianCharacters = characters => {
  const newCharacters = [];
  for (let i = 0; i < characters.length; i++) {
    if (i !== 2) {
      newCharacters.push(persianJs(characters[i]).englishNumber().toString());
    } else {
      newCharacters.push(characters[i]);
    }
  }
  return newCharacters;
};
