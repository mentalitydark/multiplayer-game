export class KeyBoard {

  /** @type {Object.<string, Function>} */
  observers = {};

  /** @type {Object.<string, boolean>} */
  keys = {};
  
  constructor() {
    document.addEventListener("keydown", ({ key }) => {
      this.keys[key] = true;
      this.notifyAllObservers({keys: this.keys});
    });
    
    document.addEventListener("keyup", ({ key }) => {
      this.keys[key] = false;
      this.notifyAllObservers({keys: this.keys});
    });
  }

  /**
   * @param {string} callBackName
   * @param {Function} callback
   */
  subscribeObserver(callBackName, callback) {
    this.observers[callBackName] = callback;
  }

  unsubscribeObserver(observerName) {
    delete this.observers[observerName];
  }

  notifyAllObservers(command) {
    for (const callBackName in this.observers) {
      const observer = this.observers[callBackName];
      observer(command);
    }

  }
}