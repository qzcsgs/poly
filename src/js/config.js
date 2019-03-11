export default {
  viewBoxWidth: 500,
  viewBoxHeight: () => {
    const start = document.querySelector('.start')
    return 500 / (start.offsetWidth / start.offsetHeight)
  },
  screenOffset: () => {
    const start = document.querySelector('.start')
    return 500 / start.offsetWidth
  },
  paddingLeft: 10,
  paddingBottom: 0,
  gameState: 'startBefore',
  spliceIndexArr: [] // 已经被拼合的polygon索引
}