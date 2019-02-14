async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function asyncMap(array, callback) {
  const res = [];
  for (let index = 0; index < array.length; index++) {
    res[index] = await callback(array[index], index, array);
  }
  return res;
}

module.exports = { asyncForEach, asyncMap };
