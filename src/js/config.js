const start = document.querySelector('.start')

export default {
  viewBoxWidth: 500,
  viewBoxHeight: 500 / (start.offsetWidth / start.offsetHeight),
  screenOffset: 500 / start.offsetWidth,
  paddingLeft: 10,
  paddingBottom: 0
}