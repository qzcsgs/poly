// import CONFIG from './CONFIG'

// /**
//  * 游戏类
//  */
// class Game {
//   constructor () {
//     this.init()
//   }

//   init () {
//     // 获取相应元素
//     this.container = document.getElementById('game')
//     this.canvas = document.getElementById('canvas')
//     this.context = canvas.getContext('2d')

//     // 开始游戏按钮
//     this.sectionButton = document.querySelector('.section-button')
//     // 玩家颜色名字，敌人数量
//     this.sectionMyColor = document.querySelector('.section-myColor')
//     this.myName = document.getElementById('myName')
//     this.sectionAiNum = document.querySelector('.section-aiNum')

//     // 得分，排行
//     this.score = document.querySelector('.score span')
//     this.rankingList = document.querySelector('.ranking-list')

//     // 背景音乐
//     this.bgAudio = document.getElementById('bg-audio')

//     // 兼容定义 requestAnimFrame
//     window.requestAnimFrame =
//       window.requestAnimationFrame ||
//       window.webkitRequestAnimationFrame ||
//       window.mozRequestAnimationFrame ||
//       window.oRequestAnimationFrame ||
//       window.msRequestAnimationFrame ||
//       function (callback) {
//         window.setTimeout(callback, 1000 / 30)
//       }
//     console.log('游戏配置', CONFIG)
//     this.event()
//   }

//   /**
//    * 游戏事件
//    */
//   event () {
//     // 监听按钮
//     this.sectionButton.onclick = () => {
//       switch (CONFIG.status) {
//         case 'start':
//           this.start()
//           break
//         case 'playing':
//           // TODOS:
//           break
//         case 'failed':
//           // TODOS:
//           break
//         case 'success':
//           // TODOS:
//           break
//         case 'all-success':
//           // TODOS:
//           break
//         case 'stop':
//           // TODOS:
//           break
//       }
//     }

//     // 鼠标移动
//     this.container.onmousemove = (e) => {
//       if (CONFIG.status !== 'playing') return
//       // canvs中像素为实际大小的两倍
//       this.mounseX = e.x * 2
//       this.mounseY = e.y * 2
//     }

//     // 键盘事件
//     document.onkeydown = (e) => {
//       var key = e.keyCode || e.which || e.charCode
//       if (key === 32 && CONFIG.status === 'playing') {
//         // 吐球防抖
//         if (this.timeId) return
//         this.timeId = setTimeout(() => {
//           this.timeId = null
//         }, 100)
//         window.spirit.player.spit()
//       }
//     }
//   }

//   /**
//    * 开始游戏
//    */
//   start () {
//     console.log('开始游戏')
//     this.updateConfig()
//     // 更新UI
//     this.container.setAttribute('data-status', CONFIG.status)
//     this.initObject()
//     // 播放音乐
//     this.bgAudio.play()
//     this.repaint()
//   }

//   /**
//    * 游戏失败
//    */
//   fail () {
//     console.log('游戏失败')
//     CONFIG.status = 'fail'
//     window.spirit.player.life = false
//   }

//   /**
//    * 更新配置文件
//    */
//   updateConfig () {
//     CONFIG.status = 'playing'
//     CONFIG.player_name = this.myName.value || CONFIG.player_name
//     CONFIG.player_color = this.sectionMyColor.value
//     CONFIG.AiPlayer_num = this.sectionAiNum.value

//     console.log('更新游戏配置', CONFIG)
//   }

//   /**
//    * 初始化相关对象
//    */
//   initObject () {
//     // AI实例
//     let aiPlayerList = []
//     for (let i = 0; i < CONFIG.AiPlayer_num; i++) {
//       aiPlayerList.push(new AiPlayer({
//         name: UTIL.getRandomName()
//       }))
//     }

//     let foodList = []
//     for (let i = 0; i < CONFIG.food_num; i++) {
//       foodList.push(new Food({
//         weight: CONFIG.food_weight
//       }))
//     }

//     window.spirit = {
//       map: new Map(), // 地图实例
//       // 玩家实例
//       player: new Player({
//         name: CONFIG.player_name,
//         color: CONFIG.player_color,
//         weight: CONFIG.player_weight,
//         centerX: 800,
//         centerY: 600
//       }),
//       aiPlayerList, // ai玩家列表
//       foodList, // 食物实例
//       vomitList: []
//     }

//     // 鼠标默认位置
//     this.mounseX = window.spirit.player.centerX
//     this.mounseY = window.spirit.player.centerY
//   }

//   /**
//    * 绘图
//    */
//   draw () {
//     // 擦除可见区域
//     this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
//     // 画出地图
//     window.spirit.map.drawMap(this.context)
//     // 画出食物
//     window.spirit.foodList.forEach(item => {
//       item.drawSelf(this.context)
//     })
//     // 画出ai玩家
//     window.spirit.aiPlayerList.forEach(item => {
//       item.drawSelf(this.context)
//     })
//     // 画出玩家
//     window.spirit.player.drawPlayer(this.context)
//     // 画出呕吐物
//     window.spirit.vomitList.forEach(item => {
//       item.drawSelf(this.context)
//     })
//   }

//   /**
//    * 碰撞检测
//    */
//   collisionDetection () {
//     let aiItemR = 0,
//         aiElemR = 0,
//         playerR = 0

//     // for循环嵌套使用外层小内层大
//     window.spirit.aiPlayerList.forEach((aiItem, aiIndex) => {
//       // ai与玩家
//       if (UTIL.collisionDetection(aiItem, window.spirit.player) && window.spirit.player.life) {
//         aiItemR = aiItem.getRadius()
//         playerR = window.spirit.player.getRadius()
        
//         // 碰撞
//         if (aiItemR > playerR) {
//           aiItem.addWeight(window.spirit.player.weight)
//           // 游戏结束
//           this.fail()
//         } else if (aiItemR < playerR) {
//           window.spirit.player.addWeight(aiItem.weight)
//           aiItem.init({    // 初始化被吃掉的ai
//             name: UTIL.getRandomName()
//           })
//         }
//       }

//       // ai与ai
//       window.spirit.aiPlayerList.forEach((elem, index) => {
//         if (index === aiIndex) return // 自己和自己比较时退出
        
//         if (UTIL.collisionDetection(aiItem, elem)) {
//           // 获取ai半径
//           aiItemR = aiItem.getRadius()
//           aiElemR = elem.getRadius()

//           if (aiItemR > aiElemR){
//             aiItem.addWeight(elem.weight)
//             elem.init({
//               name: UTIL.getRandomName()
//             })
//           } else if (aiItemR < aiElemR) {
//             elem.addWeight(aiItem.weight)
//             aiItem.init({
//               name: UTIL.getRandomName()
//             })
//           }
//         }
//       })

//       window.spirit.foodList.forEach(foodItem => {
//         // 玩家与食物
//         if (window.spirit.player.life && UTIL.collisionDetection(foodItem, window.spirit.player)) {
//           foodItem.init({ // 重新初始化被吃掉的食物
//             weight: CONFIG.food_weight,
//           })
//           window.spirit.player.addWeight(foodItem.weight)
//         }
//         // ai与食物
//         if (UTIL.collisionDetection(foodItem, aiItem)) {
//           foodItem.init({ // 重新初始化被吃掉的食物
//             weight: CONFIG.food_weight,
//           })
//           aiItem.addWeight(foodItem.weight)
//         }
//       })

//       window.spirit.vomitList.forEach((vomitItem, vomitIndex) => {
//         // 吐球与ai
//         if (UTIL.collisionDetection(vomitItem, aiItem)) {
//           aiItem.weight += vomitItem.weight // 吃吐球吃多少加多少
//           window.spirit.vomitList.splice(vomitIndex, 1)
//         }
//         // 吐球与玩家
//         // if (window.spirit.player.life && UTIL.collisionDetection(vomitItem, window.spirit.player)) {
//         //   window.spirit.player.weight += vomitItem.weight
//         //   window.spirit.vomitList.splice(vomitIndex, 1)
//         // }
//       })
//     })
//   }

//   move () {
//     // 玩家永远在屏幕中心，移动其他元素
//     window.spirit.player.move(this.mounseX, this.mounseY)
//     // ai移动
//     window.spirit.aiPlayerList.forEach(item => {
//       item.aiMove()
//     })
//   }

//   /**
//    * 重绘
//    */
//   repaint () {
//     if (CONFIG.status !== 'playing') return
//     // 碰撞检测
//     this.collisionDetection()
//     // 移动
//     this.move()
//     // 绘图
//     this.draw()
//     // 更新得分
//     UTIL.updateScore(this.score)
//     // 更新排行
//     UTIL.updateRankingList(this.rankingList)

//     requestAnimFrame(this.repaint.bind(this))
//   }
// }

// export default Game
