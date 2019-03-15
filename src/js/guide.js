import config from './config'
import Polygon from './polygon'

class Guide {
  constructor () {
    this.init()
  }

  init () {
    this.timeId_1 = null
    this.timeId_2 = null
    this.timeId_3 = null
    this.guidePolygon = null

    this.startImg = document.querySelector('.start img')
    this.wrapTips = document.querySelector('.wrap .tips')
  }

  play () {
    if (config.gameState === 'playing') { return }

    this.clearTimer()
    this.createGuidePolygon()
    this.initSpirit()

    const distance = (Spirit.waitPolygon[0].y - Spirit.picturePolygon[0].y) / config.screenOffset()  // px
    const startY = (Spirit.waitPolygon[0].y + 45) / config.screenOffset() // px
    const len = 40 // 时长1s，每20ms一次，共50次
    const stageY = distance / len // 每次运动stage个距离

    this.timeId_1 = setTimeout(() => {
      this.guideAnimationTimer(len, startY, stageY, '-')
    }, 1000)
  }

  clearTimer () {
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
  }

  createGuidePolygon () {
    if (!this.guidePolygon) {
      let guidePolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      guidePolygon.setAttribute('points', Spirit.waitPolygon[0].getPointsToString())
      guidePolygon.setAttribute('style', `fill:${Spirit.waitPolygon[0].color};`)

      Stage.picture.appendChild(guidePolygon)
      this.guidePolygon = new Polygon(guidePolygon)
      this.guidePolygon.fill()
      this.guidePolygon.showHideNumbering('hidden')
    }
  }

  initSpirit () {
    this.startImg.style.display = 'block'
    this.wrapTips.style.display = 'block'
    this.guidePolygon.polygonDom.style.display = 'block'

    this.startImg.style.top = (Spirit.waitPolygon[0].y + 45) / config.screenOffset() + 'px'
    this.startImg.style.left = (Spirit.waitPolygon[0].x + 30) / config.screenOffset() + 'px'
  }

  guideAnimationTimer (count, startY, stageY, type) {
    if (config.gameState === 'playing') { return }

    this.timeId_2 = setTimeout(() => {
      if (type === '+') {
        startY = (Spirit.picturePolygon[0].y + 45) / config.screenOffset()
        this.startImg.style.top = startY + (40 - count) * stageY + 'px'
      } else {
        this.startImg.style.top = startY - (40 - count) * stageY + 'px'
        this.guidePolygon.move(10, 100 - ((40 - count) * stageY) * config.screenOffset())
      }

      if (count === 0 && type === '-') {
        // 到达顶部
        Spirit.picturePolygon[0].setAttribute('style', 'stroke:none;fill:none;')

        this.timeId_3 = setTimeout(() => {
          this.guideAnimationTimer(40, startY, stageY, '+')
        }, 500)
        return false
      } else if (count === 0 && type === '+') {
        // 到达底部
        this.guidePolygon.move(0, 100)
        Spirit.picturePolygon[0].setAttribute('style', 'stroke:#000000;fill:none;')
        this.play()
        return false
      }
      count--
      this.guideAnimationTimer(count, startY, stageY, type)
    }, 20)
  }

  stop () {
    this.startImg.style.display = 'none'
    this.wrapTips.style.display = 'none'
    this.guidePolygon.polygonDom.style.display = 'none'
    setTimeout(() => {
      Spirit.picturePolygon[0].setAttribute('style', 'stroke:#000000;fill:none;')
      this.guidePolygon.move(0, 100)
    }, 30)
  }
}

export default Guide