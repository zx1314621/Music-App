// 获取min-max之间的整数 包括max
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export function shuffle (arr) {
  // 使用_arr是为了不直接影响arr 否则随机模式下，点击列表播放歌曲不对应
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export function debounce (func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
