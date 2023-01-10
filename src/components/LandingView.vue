<template>
  <div class=".container-fluid">
    <div id="content">
      <NavMenu/>
      <div id="mainContent">
        <TopHeader/>
        <div id="view">
          <router-view :key="$route.path"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavMenu from '@/components/NavMenu.vue'
import TopHeader from '@/components/TopHeader.vue'

export default {
  name: 'LandingView',
  components: {
    NavMenu,
    TopHeader
  }
}
</script>

<style scoped>

</style>
