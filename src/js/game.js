import Polygon from './polygon'
import Util from './util'

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
    this.polygonItem = document.querySelectorAll('.polygon-item')
    this.polygonItemSvg = document.querySelectorAll('.polygon-item svg')

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
    this.initPolygonWrap()
    this.initPicture()
  }

  initPolygonWrap () {
    this.polygonArr.forEach((item, index) => {
      const animatedPoints = item.polygonDom.animatedPoints
      let str = ''
      for (let i = 0; i < animatedPoints.length; i++) {
        const elem = animatedPoints[i]
        // 所有点减去外接矩形的x与y
        str += `${elem.x - item.x},${elem.y - item.y} `
      }
      // 将碎片填入panel的左上角
      this.polygonItemSvg[index].innerHTML = `<polygon style="fill:${item.color};" points="${str} "/>
                                              <text x="${item.center.x - item.x - 5}" y="${item.center.y - item.y + 3}">${index + 1}</text>`
      this.polygonItem[index].style = `width: ${item.width}px;height: ${item.height}px`
    })
  }

  initPicture () {
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
   * 移动活动的polygon
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
