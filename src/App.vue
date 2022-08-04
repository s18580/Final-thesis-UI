<template>
  <router-view/>
</template>

<script>
export default {
  name: 'App',
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

#mainContent {
  margin-left: 260px;
  padding: 0;
}

#view{
  padding: 24px;
  background: #f1f3fa;
}

body {
  background: #f1f3fa;
}

::-webkit-scrollbar {
  width: 0.5rem;
}

::-webkit-scrollbar-thumb {
  background: #646f7c;
  border-radius: 100vw;
}

::-webkit-scrollbar-thumb:hover {
  background: #9aaabe;
}
</style>
