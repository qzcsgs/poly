/**
 * Polygon类
 */
class Polygon {
  constructor (polygonDom) {
    this.init(polygonDom)
  }

  init (polygonDom) {
    this.polygonDom = polygonDom
    this.initPoints = this.getAnimatedPoints()
    this.externalRectangle()
  }

  /**
   * 获取外接矩形的信息
   * @description 调整dom的顶点信息后需要手动调用此方法更新
   */
  externalRectangle () {
    const animatedPoints = this.getAnimatedPoints()

    let polygonXArr = []
    let polygonYArr = []
    let maxX = 0, minX = 0
    let maxY = 0, minY = 0

    animatedPoints.forEach(item => {
      polygonXArr.push(item.x)
      polygonYArr.push(item.y)
    })

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

  getAnimatedPoints () {
    let points = []
    let pointArr = this.polygonDom.attributes.points.value.trim().split(' ')

    pointArr.forEach(item => {
      let arr = item.split(',')
      points.push({
        x: parseFloat(arr[0]),
        y: parseFloat(arr[1])
      })
    })

    return points
  }

  /**
   * @param {number} offsetX 水平方向偏移量
   * @param {number} offsetY 竖直方向偏移量
   */
  move (offsetX, offsetY) {
    let pointStr = ''

    this.initPoints.forEach(item => {
      pointStr += `${item.x + offsetX},${item.y + offsetY - 100} ` // y轴多减100保证polygon在手指上方
    })

    this.setAttribute('points', pointStr)
    this.externalRectangle()  // 更新外接矩形的信息
  }

  /**
   * 暴露DOM方法
   */
  setAttribute (key, value) {
    this.polygonDom.setAttribute(key, value)
  }
}

export default Polygon
