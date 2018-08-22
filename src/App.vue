<template>
  <div id="app">
    <m-hearder></m-hearder>
    <tab></tab>
    <!--keep-alive 将数据保存在内存中，不必每次请求-->
    <keep-alive>
      <!--router-view 轮播器-->
    <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import MHearder from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  components: {
    MHearder,
    Tab,
    Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
