import Polygon from './polygon'
import Util from './util'
import config from './config'
import lottie from './lottie'
import Audio from './audio'

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
    this.end = document.querySelector('.end')
    this.stageAnimation = document.getElementById('stage-animation')
    this.startImg = document.querySelector('.start img')
    this.wrapTips = document.querySelector('.wrap .tips')
    this.downloadWrapHand = document.querySelector('.download-wrap .hand')
    this.waitPolygonWrap = document.querySelectorAll('.wait-polygon-wrap')
    this.downloadBtn = document.querySelectorAll('.download')

    this.polygonArr = []
    this.mouseStartX = 0
    this.mouseStartY = 0
    this.isDraggable = false // 是否在拖动中
    this.currDraggableNum = 0 // 当前拖拽的第几个
    this.textIndexDomArr = []  // 序号dom集合
    this.waitPolygon = [] // 等待着被拖动的polygon
    this.pictureHTML = this.picture.innerHTML
    this.audio = this.audio || new Audio({ name: '', loop: false})
    this.guidePolygon = null

    this.initObject()
    this.event()
  }

  /**
   * 游戏事件
   */
  event () {
    window.onresize = () => this.restart()

    document.ontouchstart = (e) => {
      if (config.gameState === 'playing') { return }

      config.gameState = 'playing'
      this.startImg.style.display = 'none'
      this.wrapTips.style.display = 'none'
      this.guidePolygon.polygonDom.style.display = 'none'
      setTimeout(() => {
        this.polygonArr[0].setAttribute('style', 'stroke:#000000;fill:none;')
        this.guidePolygon.move(0, 100)
      }, 30)
    }

    document.ontouchend = (e) => {
      if (config.spliceIndexArr.length !== 0) { return }

      config.gameState = 'startBefore'
      this.startImg.style.display = 'block'
      this.wrapTips.style.display = 'block'

      this.restart()
    }

    document.ontouchmove = (e) => {
      if (!this.isDraggable) {
        return false
      }

      let offsetX = e.changedTouches[0].pageX - this.mouseStartX
      let offsetY = e.changedTouches[0].pageY - this.mouseStartY
      // 鼠标偏移量 * svg相对于屏幕的缩放比 = polygon相对于初始坐标的偏移量
      this.moveActivePolygon(offsetX * config.screenOffset(), offsetY * config.screenOffset())
    }
    
    this.waitPolygonWrap.forEach((item, index) => {
      item.ontouchstart = (e) => {
        this.isDraggable = true
        this.currDraggableNum = index

        this.mouseStartX = e.touches[0].pageX
        this.mouseStartY = e.touches[0].pageY

        this.waitPolygon[index].showHideNumbering('hidden')  // 隐藏编号
        this.moveActivePolygon(0, 0)
      }

      item.ontouchend = () => {
        this.isDraggable = false
        this.collisionDetection()
      }
    })
  }

  /**
   * 初始化相关对象
   */
  initObject () {
    // 遍历初始化所有polygon
    // this.picturePolygon.forEach((item, index) => {
    //   this.polygonArr.push(new Polygon(item, index + 1))
    // })
    // 需求4块
    this.polygonArr = [
      new Polygon(this.picturePolygon[0], 1),
      new Polygon(this.picturePolygon[54], 2),
      new Polygon(this.picturePolygon[59], 3),
      new Polygon(this.picturePolygon[72], 4)
    ]
    
    this.initPicture()
    this.playGuideAnimation()
  }

  /**
   * 初始化picture
   */
  initPicture () {
    // 根据屏幕比例设置viewBox
    this.picture.setAttribute('viewBox', `0 0 ${config.viewBoxWidth} ${config.viewBoxHeight()}`)
    this.initWaitPolygonAndText()
  }

  /**
   * 初始化待拖动polygon
   */
  initWaitPolygonAndText () {
    this.polygonArr.forEach((item, index) => {
      const animatedPoints = item.getAnimatedPoints()
      let str = ''

      animatedPoints.forEach(elem => {
        // 1.将碎片重置到0,0
        // 2.加上屏幕高度 - 自身高度 - 底边距 = y
        // 3.加上屏幕左边距 + n倍的140 = x
        str += `${elem.x - item.x + (index * 140) + config.paddingLeft},${elem.y - item.y + config.viewBoxHeight() - item.height - config.paddingBottom} `
      })
     
      // polygon
      let polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      polygon.setAttribute('style', `fill:${item.color};`)
      polygon.setAttribute('points', str)

      // 横竖屏转换前已经拼合的不需要再进行初始化
      if (config.spliceIndexArr.indexOf(index) === -1) {
        this.picture.appendChild(polygon)
      }

      let polygonObj = new Polygon(polygon, index + 1)
      polygonObj.fill()
      polygonObj.showHideNumbering('visible')
      this.waitPolygon.push(polygonObj) // 储存

      // 外接矩形，为了增加触摸面积
      this.waitPolygonWrap[index].style.top = this.waitPolygon[index].y / config.screenOffset() + 'px'
      this.waitPolygonWrap[index].style.left = this.waitPolygon[index].x / config.screenOffset() + 'px'
      this.waitPolygonWrap[index].style.width = this.waitPolygon[index].width / config.screenOffset() + 'px'
      this.waitPolygonWrap[index].style.height = this.waitPolygon[index].height / config.screenOffset() + 'px'
    })
  }

  restart () {
    this.picture.innerHTML = this.pictureHTML
    this.init()
  }

  playGuideAnimation () {
    if (config.gameState === 'playing') { return }
    if (this.timeId_1) {
      clearTimeout(this.timeId_1)
      this.timeId_1 = null
    }
    if (this.timeId_2) { 
      clearTimeout(this.timeId_2)
      this.timeId_2 = null
    }
    if (this.timeId_3) { 
      clearTimeout(this.timeId_3)
      this.timeId_3 = null
    }

    if (!this.guidePolygon) {
      let guidePolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      guidePolygon.setAttribute('points', this.waitPolygon[0].getPointsToString())
      guidePolygon.setAttribute('style', `fill:${this.waitPolygon[0].color};`)
      this.picture.appendChild(guidePolygon)
      this.guidePolygon = new Polygon(guidePolygon)
      this.guidePolygon.fill()
      this.guidePolygon.showHideNumbering('hidden')
    }

    this.startImg.style.top = (this.waitPolygon[0].y + 45) / config.screenOffset() + 'px'
    this.startImg.style.left = (this.waitPolygon[0].x + 30) / config.screenOffset() + 'px'

    const distance = (this.waitPolygon[0].y - this.polygonArr[0].y) / config.screenOffset()  // px
    const startY = (this.waitPolygon[0].y + 45) / config.screenOffset() // px
    const len = 40 // 时长1s，每20ms一次，共50次
    const stageY = distance / len // 每次运动stage个距离

    this.timeId_1 = setTimeout(() => {
      this.guideAnimationTimer(len, startY, stageY, '-')
    }, 1000)
  }

  guideAnimationTimer (count, startY, stageY, type) {
    if (config.gameState === 'playing') { return }
    this.timeId_2 = setTimeout(() => {
      if (type === '+') {
        startY = (this.polygonArr[0].y + 45) / config.screenOffset()
        this.startImg.style.top = startY + (40 - count) * stageY + 'px'
      } else {
        this.startImg.style.top = startY - (40 - count) * stageY + 'px'
        this.guidePolygon.move(10, 100 - ((40 - count) * stageY) * config.screenOffset())
      }

      if (count === 0 && type === '-') {
        // 到达顶部
        this.polygonArr[0].setAttribute('style', 'stroke:none;fill:none;')

        this.timeId_3 = setTimeout(() => {
          this.guideAnimationTimer(40, startY, stageY, '+')
        }, 500)
        return
      } else if (count === 0 && type === '+') {
        // 到达底部
        this.guidePolygon.move(0, 100)
        this.polygonArr[0].setAttribute('style', 'stroke:#000000;fill:none;')
        this.playGuideAnimation()
        return
      }
      count--
      this.guideAnimationTimer(count, startY, stageY, type)
    }, 20)
  }

  /**
   * 移动被拖动的polygon
   * @param {number} offsetX 水平方向偏移量
   * @param {number} offsetY 竖直方向偏移量
   * @param {number} index 要移动的polygon索引
   */
  moveActivePolygon (offsetX, offsetY, index) {
    index = index === undefined ? this.currDraggableNum : index
    this.waitPolygon[index].move(offsetX, offsetY)
  }

  /**
   * 碰撞检测
   */
  collisionDetection () {
    let currPolygon = this.polygonArr[this.currDraggableNum]
    let polygonActive = this.waitPolygon[this.currDraggableNum]
    
    if (Util.rectCollisioDetection(currPolygon, polygonActive)) {
      currPolygon.fill()
      this.picture.removeChild(polygonActive.polygonDom)  // 删除拖动的polygon
      this.showStageAnimation()
      this.audio.play({ name: 'success' })

      config.spliceIndexArr.push(this.currDraggableNum)
      config.spliceIndexArr.length === this.polygonArr.length ? this.gameOver() : ''
    } else {
      this.audio.play({ name: 'miss' })

      // reset
      this.moveActivePolygon(0, 100)
      polygonActive.showHideNumbering('visible')
    }
  }

  showStageAnimation () {
    this.stageAnimation.innerHTML = ''
    let currPolygon = this.polygonArr[this.currDraggableNum]

    this.stageAnimation.style.width = (100 / config.screenOffset()) + 'px'
    this.stageAnimation.style.height = (100 / config.screenOffset()) + 'px'
    this.stageAnimation.style.top = currPolygon.y / config.screenOffset() + 'px'
    this.stageAnimation.style.left = currPolygon.x / config.screenOffset() + 'px'
    // 通用的方法, 稍有偏差
    // this.stageAnimation.style.transform = `translate(-${((100 - currPolygon.width) / 2) / config.screenOffset()}px, -${((100 - currPolygon.height) / 2) / config.screenOffset()}px)`

    // 为了美观手动计算了4个位置
    if (this.currDraggableNum === 0) {
      this.stageAnimation.style.transform = `translate(${10 / config.screenOffset()}px, -${10 / config.screenOffset()}px)`
    } else if (this.currDraggableNum === 1) {
      this.stageAnimation.style.transform = `translate(-${25 / config.screenOffset()}px, -${30 / config.screenOffset()}px)`
    } else if (this.currDraggableNum === 2) {
      this.stageAnimation.style.transform = `translate(-${30 / config.screenOffset()}px, -${35 / config.screenOffset()}px)`
    } else if (this.currDraggableNum === 3) {
      this.stageAnimation.style.transform = `translate(-${28 / config.screenOffset()}px, -${30 / config.screenOffset()}px)`
    }

    lottie.loadAnimation({
      container: document.getElementById('stage-animation'),
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: 'stage.json'
    })
  }

  gameOver () {
    this.audio.play({ name: 'over' })
    lottie.loadAnimation({
      container: document.getElementById('end-animation'),
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: 'success.json'
    })

    setTimeout(() => {
      this.downloadWrapHand.src = this.startImg.src
      this.downloadBtn[1].src = this.downloadBtn[0].src
      this.end.classList.add('active')
    }, 1000)
  }
}

export default Game
