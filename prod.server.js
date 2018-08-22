var config = require('./config/index')

// 后端代理
const express = require('express')
const axios = require('axios')

var app = express()

var apiRoutes = express.Router()

// 取得分类歌单数据
apiRoutes.get('/getDiscList', function (req, res) {
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })

// 获得播放歌曲所需的V-key
  apiRoutes.get('/music', function (req, res) {
          var url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'

          axios.get(url, {
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query
          }).then((response) => {

            res.json(response.data)

          }).catch((e) => {
            console.log(e)
          })
        })

// 获得歌词
  apiRoutes.get('/lyric', function (req, res) {
          var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

          axios.get(url, {
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query
          }).then((response) => {
            var ret = response.data
            if (typeof  ret === 'string') {
              // 正则表达式 将请求得到的jsonp数据切割成我们需要的字段，并在之后转换成json数据
              var reg = /^\w+\(({[^()]+})\)$/
              // var reg = /^\w+\(({[^()]+})\)$/
              var matches = ret.match(reg)
              if (matches) {
                ret = JSON.parse(matches[1])
              }
            }

            res.json(ret)

          }).catch((e) => {
            console.log(e)
          })
        })

// 获取搜索结果
  apiRoutes.get('/search', function (req, res) {
          var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

          axios.get(url, {
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query
          }).then((response) => {

            res.json(response.data)

          }).catch((e) => {
            console.log(e)
          })
        })

// 获得推荐榜单数据
  apiRoutes.get('/recommendList', function (req, res) {
          var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

          axios.get(url, {
            headers: {

              // 两个都可以
              referer: 'https://c.y.qq.com/',
              // referer: 'https://y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query
          }).then((response) => {

            res.json(response.data)

          }).catch((e) => {
            console.log(e)
          })
        })

app.use('/api', apiRoutes)

app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
