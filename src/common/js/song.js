import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
    /* this.filename = filename
    this.vkey = vkey */
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
          // console.log(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

export function createSong(musicData, songVkey) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?vkey=${songVkey}&guid=6442406400&uin=0&fromtag=66`
  })
}
// export function createSong(musicData) {
//   return new Song({
//     id: musicData.songid,
//     mid: musicData.songmid,
//     singer: filterSinger(musicData.singer),
//     name: musicData.songname,
//     album: musicData.albumname,
//     duration: musicData.interval,
//     image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
//     url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?vkey=&guid=6442406400&uin=0&fromtag=66`
//   })
// }

function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

/* function _getVKey (musicData) {
  // console.log(123 + getVKey(musicData.songmid))
  getVKey(musicData.songmid).then((res) => {
    if (res.code === ERR_OK) {
      return res.data.items.vkey
    }
  })
} */
