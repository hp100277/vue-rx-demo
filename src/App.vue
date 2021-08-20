<template>
  <div id="app">
    <div id="nav">
      <router-link v-for="(l, index) in lessons" :to="l.to" :key="index">
        {{ l.lessonName }}
      </router-link>
    </div>
    <router-view class="view-content" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      lessons: [],
    };
  },
  created() {
    this.lessons = this.$router.options.routes.map((r) => {
      return {
        to: r.path,
        lessonName: r.lessonName,
      };
    });
  },
};
</script>
<style lang="scss">
html,
body,
#app {
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#app {
  padding: 12px;
  display: flex;
}

#nav {
  flex: 0 0 auto;
  width: 140px;
  padding: 0 12px;
  text-align: left;
  border-right: solid 1px #42b983;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  a {
    font-weight: bold;
    color: #2c3e50;
    margin: 4px 0;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.view-content {
  flex: 1 1 auto;
  padding: 12px;
  text-align: left;
  &[class^="lesson"] .result {
    display: inline-block;
    background-color: #000;
    color: #fff;
    padding: 12px;
    border-radius: 4px;
    min-width: 180px;
    font-family: PragmataPro, "Lucida Console", Courier, monospace;
  }

  button + button {
    margin-left: 4px;
  }
}
</style>
