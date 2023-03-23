function normalize(array) {
  const result = array.reduce((accumulator, currentValue) => {
    const item = currentValue.trim();

    if (item !== "") {
      accumulator.push(item);
    }

    return accumulator;
  }, []);
  return result;
}

module.exports = normalize;
