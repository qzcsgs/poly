import Polygon from './polygon'
import Util from './util'
import config from './config'

/**
 * 游戏类
 */
class Game {
  constructor () {
    this.init()
  }

  init () {
    // 获取相应元素
    this.picture = document.querySelector('#picture')
    this.picturePolygon = document.querySelectorAll('#picture polygon')

    this.mouseStartX = 0
    this.mouseStartY = 0
    this.isDraggable = false // 是否在拖动中
    this.currDraggableNum = 0 // 当前拖拽的第几个
    this.textIndexDomArr = []  // 序号dom集合
    this.waitPolygonAndText = [] // 等待着被拖动的polygon和text

    this.initObject()
    this.event()
  }

  /**
   * 游戏事件
   */
  event () {
    document.addEventListener('touchmove', (e) => {
      if (!this.isDraggable) {
        return false
      }
      e.preventDefault()

      let offsetX = e.changedTouches[0].pageX - this.mouseStartX
      let offsetY = e.changedTouches[0].pageY - this.mouseStartY
      // 鼠标偏移量 * svg相对于屏幕的缩放比 = polygon相对于初始坐标的偏移量
      this.moveActivePolygon(offsetX * config.screenOffset, offsetY * config.screenOffset)
    })

    this.waitPolygonAndText.forEach((item, index) => {
      const onTouchEnd = (e) => {
        e.preventDefault()
        this.isDraggable = false
        this.collisionDetection()
      }
      const onTouchStart = (e) => {
        e.preventDefault()
        this.isDraggable = true
        this.currDraggableNum = index

        this.mouseStartX = e.touches[0].pageX
        this.mouseStartY = e.touches[0].pageY

        this.waitPolygonAndText[index].text.style.visibility = 'hidden'  // 隐藏编号
      }
      
      item.polygon.addEventListener('touchstart', onTouchStart)
      item.text.addEventListener('touchstart', onTouchStart)
      item.polygon.addEventListener('touchend', onTouchEnd)
      item.text.addEventListener('touchend', onTouchEnd)
    })
  }

  /**
   * 初始化相关对象
   */
  initObject () {
    // 遍历初始化所有polygon, 需求只需要4块
    this.polygonArr = [
      new Polygon(this.picturePolygon[0]),
      new Polygon(this.picturePolygon[54]),
      new Polygon(this.picturePolygon[59]),
      new Polygon(this.picturePolygon[72])
    ]
    this.initPicture()
  }

  /**
   * 初始化picture
   */
  initPicture () {
    this.initWaitPolygonAndText()
    // 根据屏幕比例设置viewBox
    this.picture.setAttribute('viewBox', `0 0 ${config.viewBoxWidth} ${config.viewBoxHeight}`)

    this.polygonArr.forEach((item, index) => {
      item.setAttribute('style', 'stroke:#000000;fill:none;') // 绘制边框
      // 添加编号
      let text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', `${item.center.x - 5}`)
      text.setAttribute('y', `${item.center.y + 3}`)
      text.innerHTML = `${index + 1}`

      this.textIndexDomArr.push(text)
      this.picture.appendChild(text)
    })
  }

  /**
   * 初始化待拖动polygon
   */
  initWaitPolygonAndText () {
    this.polygonArr.forEach((item, index) => {
      const animatedPoints = item.polygonDom.animatedPoints
      let str = ''
      for (let i = 0; i < animatedPoints.length; i++) {
        const elem = animatedPoints[i]
        // 1.将碎片重置到0,0
        // 2.加上屏幕高度 - 自身高度 - 底边距 = y
        // 3.加上屏幕左边距 + n倍的140 = x
        str += `${elem.x - item.x + (index * 140) + config.paddingLeft},${elem.y - item.y + config.viewBoxHeight - item.height - config.paddingBottom} `
      }
      // polygon
      let polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      polygon.setAttribute('style', `fill:${item.color};`)
      polygon.setAttribute('points', str)
      // 编号
      let text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', `${item.center.x - item.x - 5 + (index * 140) + config.paddingLeft}`)
      text.setAttribute('y', `${item.center.y - item.y + 3 + config.viewBoxHeight - item.height - config.paddingBottom}`)
      text.innerHTML = index + 1
      // 添加到picture
      this.picture.appendChild(polygon)
      this.picture.appendChild(text)
      this.waitPolygonAndText.push({ polygon: new Polygon(polygon), text }) // 储存
    })
  }

  /**
   * 移动被拖动的polygon
   * @param {number} offsetX 水平方向偏移量
   * @param {number} offsetY 竖直方向偏移量
   */
  moveActivePolygon (offsetX, offsetY) {
    let pointStr = ''
    let startPoint = this.waitPolygonAndText[this.currDraggableNum].polygon.initPoints
    
    for (let i = 0; i < startPoint.length; i++) {
      let points = startPoint[i]
      pointStr += `${points.x + offsetX},${points.y + offsetY - 100} ` // y轴多减50保证polygon在手指上方
    }

    this.waitPolygonAndText[this.currDraggableNum].polygon.setAttribute('points', pointStr)
    this.waitPolygonAndText[this.currDraggableNum].polygon.externalRectangle()  // 更新外接矩形的信息
  }

  /**
   * 碰撞检测
   */
  collisionDetection () {
    let currPolygon = this.polygonArr[this.currDraggableNum]
    let polygonActive = this.waitPolygonAndText[this.currDraggableNum].polygon
    
    if (Util.rectCollisioDetection(currPolygon, polygonActive)) {
      currPolygon.polygonDom.setAttribute('style', `stroke:none;fill:${currPolygon.color};`)  // 涂色
      this.picture.removeChild(this.textIndexDomArr[this.currDraggableNum]) // 删除编号
      this.picture.removeChild(this.waitPolygonAndText[this.currDraggableNum].polygon.polygonDom)  // 删除拖动的polygon
    } else {
      // reset
      this.moveActivePolygon(0, 100)
      this.waitPolygonAndText[this.currDraggableNum].text.style.visibility = 'visible'
    }
  }
}

export default Game
