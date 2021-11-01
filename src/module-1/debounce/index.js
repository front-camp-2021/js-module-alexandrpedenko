export const debounce = (fn, delay = 0) => {
  let timeout;

  return function executedFunction() {
    const context = this;
    const args = arguments;

    let later = function () {
      timeout = null;
      fn.apply(context, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
};
