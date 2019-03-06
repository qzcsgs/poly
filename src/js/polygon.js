/**
 * Polygon类
 */
class Polygon {
  constructor (polygonDom) {
    this.init(polygonDom)
  }

  init (polygonDom) {
    this.polygonDom = polygonDom
    this.initPoints()
    this.externalRectangle()
  }

  initPoints () {
    const animatedPoints = this.polygonDom.animatedPoints
    this.initPoints = [] // 初始化时的顶点坐标
    for (let i = 0; i < animatedPoints.length; i++) {
      this.initPoints.push({ x: animatedPoints[i].x, y: animatedPoints[i].y })
    }
  }

  /**
   * 获取外接矩形的信息
   * @description 调整dom的顶点信息后需要手动调用此方法更新
   */
  externalRectangle () {
    const animatedPoints = this.polygonDom.animatedPoints
    let polygonXArr = []
    let polygonYArr = []
    let maxX = 0, minX = 0
    let maxY = 0, minY = 0

    for (let i = 0; i < animatedPoints.length; i++) {
      polygonXArr.push(animatedPoints[i].x)
      polygonYArr.push(animatedPoints[i].y)
    }

    maxX = Math.max.apply(null, polygonXArr)
    maxY = Math.max.apply(null, polygonYArr)
    minX = Math.min.apply(null, polygonXArr)
    minY = Math.min.apply(null, polygonYArr)
    
    this.x = minX
    this.y = minY
    this.width = maxX - minX
    this.height = maxY - minY
    this.color = this.polygonDom.outerHTML.match(/fill:\s?(.+);/)[1]
    this.center = {
      x: eval(polygonXArr.join('+')) / animatedPoints.length,
      y: eval(polygonYArr.join('+')) / animatedPoints.length
    }
  }

  /**
   * 暴露DOM方法
   */
  setAttribute (key, value) {
    this.polygonDom.setAttribute(key, value)
  }
  addEventListener (name, func, bool = true) {
    this.polygonDom.addEventListener(name, func, bool)
  }

  /**
   * 将顶点坐标拼接成html标签属性上的格式
   * @param {number} offsetX 水平方向偏移量
   * @param {number} offsetY 竖直方向偏移量
   * @return {string}
   */
  getAnimatedPointsToStrign (points, offsetX = 0, offsetY = 0) {
    let initPoints = points || this.initPoints
    let pointStr = ''

    for (let i = 0; i < initPoints.length; i++) {
      let point = initPoints[i]
      pointStr += `${point.x + offsetX},${point.y + offsetY} `
    }

    return pointStr
  }
}

export default Polygon
