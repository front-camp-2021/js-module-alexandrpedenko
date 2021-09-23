export const cutStrings = (arr = []) => {
  let lowestIndex = 0;

  if (arr.length < 1) return [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length < arr[lowestIndex].length) {
      lowestIndex = i;
    }
  }

  return arr.map((arrElement) => arrElement.slice(0, arr[lowestIndex].length));
};
