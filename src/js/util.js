class Util {
  /**
   * 矩形碰撞检测
   * @param {object} rect1
   * @param {object} rect2
   * @return {boolean}
   */
  static rectCollisioDetection(rect1, rect2) {
    if (!(rect1.x + rect1.width < rect2.x) &&
        !(rect2.x + rect2.width < rect1.x) &&
        !(rect1.y + rect1.height < rect2.y) &&
        !(rect2.y + rect2.height < rect1.y)) {
      return true
    } else {
      return false
    }
  }
}

export default Util
