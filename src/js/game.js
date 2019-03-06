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

    this.pictureStartPoint = {
      0: [{ x: 20.3, y: 561.1 }, { x: 127.6, y: 648.6 }, { x: 109.3, y: 612.7 }],
      1: [{ x: 252.8, y: 678.5 }, { x: 217.9, y: 650.4 }, { x: 193.5, y: 664.5 }, { x: 200.4, y: 697.7 }],
      2: [{ x: 339.1, y: 704.1 }, { x: 310.3, y: 700.7 }, { x: 310.6, y: 675.9 }, { x: 372.5, y: 673.3 }],
      3: [{ x: 443.7, y: 634.6 }, { x: 426.6, y: 653.4 }, { x: 420.9, y: 694 }, { x: 464.2, y: 648.9 }, { x: 473.1, y: 638.2 }],
    }
    this.mouseStartX = 0
    this.mouseStartY = 0
    this.isDraggable = false // 是否在拖动中
    this.currDraggableNum = 0 // 当前拖拽的第几个
    this.textIndexDomArr = []  // 序号dom集合
    this.polygonItem = [] // 等待着被拖动的polygon和text

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
      
      this.moveActivePolygon(offsetX * 1.2, offsetY * 1.2)
    })

    this.polygonItem.forEach((item, index) => {
      item.addEventListener('touchstart', (e) => {
        e.preventDefault()
        this.isDraggable = true
        this.currDraggableNum = index

        this.mouseStartX = e.touches[0].pageX
        this.mouseStartY = e.touches[0].pageY
        this.showActivePolygon()
      })

      item.addEventListener('touchend', (e) => {
        e.preventDefault()
        this.isDraggable = false
        this.collisionDetection()
        this.picture.removeChild(this.picture.lastChild)
      })
    })
  }

  /**
   * 初始化相关对象
   */
  initObject () {
    let polygonActive = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    polygonActive.setAttribute('style', `fill:#000000;`)
    polygonActive.setAttribute('points', `20.3,561.1 127.6,648.6 109.3,612.7 `)
    this.polygonActive = new Polygon(polygonActive)

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
    this.initPolygonWrap()
    this.picture.setAttribute('viewBox', `0 0 ${config.viewBoxWidth} ${config.viewBoxHeight}`)
    this.picturePolygon[0].style = 'stroke:#000000;fill:none;'
    this.picturePolygon[54].style = 'stroke:#000000;fill:none;'
    this.picturePolygon[59].style = 'stroke:#000000;fill:none;'
    this.picturePolygon[72].style = 'stroke:#000000;fill:none;'

    this.polygonArr.forEach((item, index) => {
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
  initPolygonWrap () {
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
      let polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      let text = document.createElementNS('http://www.w3.org/2000/svg', 'text')

      polygon.setAttribute('style', `fill:${item.color};`)
      polygon.setAttribute('points', str)
      text.setAttribute('x', `${item.center.x - item.x - 5 + (index * 140) + config.paddingLeft}`)
      text.setAttribute('y', `${item.center.y - item.y + 3 + config.viewBoxHeight - item.height - config.paddingBottom}`)
      text.innerHTML = index + 1

      this.picture.appendChild(polygon)
      this.picture.appendChild(text)

    })
  }

  /**
   * 移动被拖动的polygon
   * @param {number} offsetX 水平方向偏移量
   * @param {number} offsetY 竖直方向偏移量
   */
  moveActivePolygon (offsetX, offsetY) {
    let pointStr = ''
    let startPoint = this.pictureStartPoint[this.currDraggableNum]

    for (let i = 0; i < startPoint.length; i++) {
      let points = startPoint[i]
      pointStr += `${points.x + offsetX},${points.y + offsetY} `
    }
    this.polygonActive.setAttribute('points', pointStr)
    this.polygonActive.externalRectangle()  // 更新外接矩形的信息
  }

  showActivePolygon () {
    // 隐藏panel中被拖动的碎片
    this.polygonItem[this.currDraggableNum].style.visibility = 'hidden'
    this.polygonActive.setAttribute('style', `fill:${this.polygonArr[this.currDraggableNum].color};`)
    this.polygonActive.setAttribute('points', this.polygonActive.getAnimatedPointsToStrign(this.pictureStartPoint[this.currDraggableNum]))
    this.picture.appendChild(this.polygonActive.polygonDom)
  }

  /**
   * 碰撞检测
   */
  collisionDetection () {
    let currPolygon = this.polygonArr[this.currDraggableNum]
    if (Util.rectCollisioDetection(currPolygon, this.polygonActive)) {
      currPolygon.polygonDom.setAttribute('style', `stroke:none;fill:${currPolygon.color};`)
      this.picture.removeChild(this.textIndexDomArr[this.currDraggableNum])
    } else {
    this.polygonItem[this.currDraggableNum].style.visibility = 'visible'
    }
  }
}

export default Game
