export const cutStrings = (arr = []) => {
  let lowestIndex = 0;
  let shortestString = "";

  if (arr.length < 1) return [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length < arr[lowestIndex].length) {
      lowestIndex = i;
      shortestString = arr[lowestIndex];
    }
  }

  return arr.map((arrElement) => arrElement.slice(0, shortestString.length));
};
