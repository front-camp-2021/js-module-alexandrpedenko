export const weirdString = (str = "") => {
  if (str.length < 1) return "";

  return str
    .split(" ")
    .map((element) => {
      return (
        element.slice(0, element.length - 1).toUpperCase() +
        element[element.length - 1].toLowerCase()
      );
    })
    .join(" ");
};
