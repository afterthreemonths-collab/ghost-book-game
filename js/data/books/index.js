const { palaceBook01 } = require('./palace-book-01-outline');
const { systemPetBook01 } = require('./system-pet-01');

const books = {
  [palaceBook01.id]: palaceBook01,
  [systemPetBook01.id]: systemPetBook01
};

module.exports = {
  books,
  palaceBook01,
  systemPetBook01
};

