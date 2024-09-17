/**
 * @returns A new randomized array
 */
Array.prototype.toShuffled = function() {
  const array = [...this];

  for (let i = array.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [array[i], array[rand]] = [array[rand], array[i]];
  }

  return array;
}
