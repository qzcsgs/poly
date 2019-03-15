import config from './config'
/**
 * Polygon类
 * @param {object} polygonDom polygon DOM 对象
 * @param {number} index 编号
 */
class Polygon {
  constructor (polygonDom, index) {
    this.init(polygonDom, index)
  }

  init (polygonDom, index) {
    this.polygonDom = polygonDom
    this.index = index || 0
    this.initPoints = this.getAnimatedPoints()
    this.externalRectangle()
    this.addIndex()
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
    let pointArr = this.getPointsToString().split(' ')

    pointArr.forEach(item => {
      let arr = item.split(',')
      points.push({
        x: parseFloat(arr[0]),
        y: parseFloat(arr[1])
      })
    })

    return points
  }

  getPointsToString () {
    return this.polygonDom.attributes.points.value.trim()
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
   * 添加编号
   */ 
  addIndex () {
    this.text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    this.text.setAttribute('x', `${this.center.x - 5}`)
    this.text.setAttribute('y', `${this.center.y + 3}`)
    this.text.innerHTML = `${this.index}`
    
    if (config.spliceIndexArr.indexOf(this.index - 1) != -1) { return false }  // 已经拼合的不需要添加编号
    Stage.picture.appendChild(this.text)
    this.fill()
  }

  /**
   * 涂色，会自动判断当前状态
   */
  fill () {
    let stroke = this.polygonDom.outerHTML.match(/stroke:\s?(n?)/)

    if (stroke !== null && stroke[1] !== 'n') {
      // 填充颜色
      this.setAttribute('style', `stroke:none;fill:${this.color};`)
      this.text.style.visibility = 'hidden'
    } else {
      // 取消填充颜色
      this.setAttribute('style', `stroke:#000000;fill:none;`)
      this.text.style.visibility = 'visible'
    }
  }

  /**
   * 控制编号显示隐藏
   */
  showHideNumbering (visibility) {
    this.text.style.visibility = visibility
  }

  /**
   * 暴露DOM方法
   */
  setAttribute (key, value) {
    this.polygonDom.setAttribute(key, value)
  }
}

export default Polygon
