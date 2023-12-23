/**
 * @callback observerCallback
 * @param {Object.<string, boolean>} command
 * @returns void
 */

export class KeyBoard {

  /** @type {observerCallback[]} */
  observers = [];

  /** @type {Object.<string, boolean>} */
  keys = {};
  
  constructor() {
    document.addEventListener("keydown", ({ key }) => {
      this.keys[key] = true;

      this.notifyAllObservers();
    });
    document.addEventListener("keyup", ({ key }) => {
      this.keys[key] = false;
      this.notifyAllObservers();
    });
  }

  /**
   * @param {observerCallback} callback 
   */
  subscribeObserver(callback) {
    this.observers.push(callback);
  }

  notifyAllObservers() {
    for (const observer of this.observers)
      observer(this.keys);
  }
}