import Polygon from './polygon'

/**
 * 游戏类
 */
class Game {
  constructor () {
    this.init()
  }

  init () {
    // 获取相应元素
    this.picturePolygon = document.querySelectorAll('#picture polygon')
    this.polygonItemSvg = document.querySelectorAll('.polygon-item svg')
    
    this.event()
    this.initObject()
  }

  /**
   * 游戏事件
   */
  event () {
    
  }

  /**
   * 开始游戏
   */
  start () {
    
  }

  /**
   * 初始化相关对象
   */
  initObject () {
    this.picturePolygon[0].style = 'stroke:#000;fill:none;'
    this.picturePolygon[54].style = 'stroke:#000;fill:none;'
    this.picturePolygon[59].style = 'stroke:#000;fill:none;'
    this.picturePolygon[72].style = 'stroke:#000;fill:none;'

    this.polygonArr = [
      new Polygon(this.picturePolygon[0]),
      new Polygon(this.picturePolygon[54]),
      new Polygon(this.picturePolygon[59]),
      new Polygon(this.picturePolygon[72])
    ]

    this.polygonWrap()
  }

  polygonWrap () {
    // this.polygonArr.forEach((item, index) => {
      
    // })

    // this.polygonItemSvg[0].appendChild(this.picturePolygon[0])
    // this.polygonItemSvg[1].appendChild(this.picturePolygon[54])
    // this.polygonItemSvg[2].appendChild(this.picturePolygon[59])
    // this.polygonItemSvg[3].appendChild(this.picturePolygon[72])
  }

  /**
   * 碰撞检测
   */
  collisionDetection () {
    
  }
}

export default Game
