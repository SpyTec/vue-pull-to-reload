// http://www.alloyteam.com/2012/11/javascript-throttle/

export function throttle (fn: any, delay: any, mustRunDelay = 0): Function {
  let timer: any = null;
  let tStart: any;
  return function () {
    // @ts-ignore
    const context = this;
    const args = arguments;
    const tCurr = +new Date();
    clearTimeout(timer);
    if (!tStart) {
      tStart = tCurr;
    }
    if (mustRunDelay !== 0 && tCurr - tStart >= mustRunDelay) {
      fn.apply(context, args);
      tStart = tCurr;
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  };
}
