<template>
  <div class=".container-fluid">
    <div id="content">
      <NavMenu/>
      <div id="mainContent">
        <TopHeader/>
        <div id="view">
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavMenu from '@/components/NavMenu.vue'
import TopHeader from '@/components/TopHeader.vue'

export default {
  name: 'App',
  components: {
    NavMenu,
    TopHeader
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

#mainContent {
  margin-left: 260px;
  padding: 0;
}

#view{
  padding: 12px;
  background: #f1f3fa;
}
</style>
