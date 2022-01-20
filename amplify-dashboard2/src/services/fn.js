
/**
 * Wraps function `func` so it run no more than once every `wait` milliseconds.
 * 
 * E.g.:
 * ```
 * const example = fn.debounce(obj => obj.x++, 1000); // invoke no more than once a second;
 * const obj = {x: 1};
 * setInterval(() => console.info(example(obj)), 300); // prints: 1, 1, 1, 2, 2, 3, 3...
 * ```
 * 
 * @param {function} func Function to be wrapped.
 * @param {number} wait Minimal time between invokation in miliseconds.
 * @returns The wrapped function.
 */
function debounce(func, wait) {
  var lastArgs,
      lastResult,
      lastThis,
      nextAllowedTime = 0,
      timer;

  function run(now) {
    const args = lastArgs, thisArg = lastThis;
    lastArgs = lastThis = undefined;
    nextAllowedTime = now + wait;
    return lastResult = func.apply(thisArg, args);
  }

  function runLast(now) {
    timer = undefined;
    if (lastArgs) return run(now);
    lastArgs = lastThis = undefined;
    return lastResult;
  }

  function timerExpired() {
    const now = new Date().valueOf(), wait = nextAllowedTime - now;
    if (wait <= 0) runLast(now);
    timer = setTimeout(timerExpired, wait);
  }

  function debounced() {
    const now = new Date().valueOf();

    lastArgs = arguments;
    lastThis = this;

    if (now < nextAllowedTime) {
      timer = timer ?? setTimeout(timerExpired, wait);
      return lastResult;
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(timerExpired, wait);
    return run(now);
  }

  debounced.cancel = function () {
    if (timer !== undefined) clearTimeout(timer);
    lastArgs = lastThis = timer = undefined;
  }

  debounced.flush = () => timer ? runLast(new Date().valueOf()) : lastResult;

  return debounced;
}

export default { debounce };