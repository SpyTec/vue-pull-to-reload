export function createEvent (name, ...opts) {
  const evt = document.createEvent('Events');
  evt.initEvent(name, ...opts);
  return evt;
}
