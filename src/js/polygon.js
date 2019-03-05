/**
 * Polygon类
 */
class Polygon {
  constructor (polygonDom) {
    this.init(polygonDom)
  }

  init (polygonDom) {
    this.polygonDom = polygonDom
    this.externalRectangle()
  }

  /**
   * 获取外接矩形的坐标和宽高
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
  }
}

export default Polygon
