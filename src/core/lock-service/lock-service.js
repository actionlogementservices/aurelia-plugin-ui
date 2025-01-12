/**
 * Implements the lock service.
 * @category lock
 */
export class LockService {
  /**
   * Is the lock active?
   * @type {boolean}
   */
  isLocked = false;

  /**
   * Activates the lock.
   */
  lock() {
    this.isLocked = true;
  }

  /**
   * Releases the lock.
   */
  unlock() {
    this.isLocked = false;
  }
}
