export function warning(msg, context='') {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof console !== 'undefined') {
      console.error('[s-flux warn]: ' + msg + ' (' + context + ')');
    }
  }
}

export function error(msg, context='') {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof console !== 'undefined') {
      throw new Error('[s-flux warn]: ' + msg + ' (' + context + ')');
    }
  }
}
