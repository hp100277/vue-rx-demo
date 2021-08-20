<template>
  <div class="lesson10">
    <h3>Lesson 10：延迟运算</h3>
    <span
      class="str"
      :class="{ 'cur-str': curIndex === index }"
      v-for="(str, index) in string"
      :key="index"
    >
      {{ str }}
    </span>
    <br />
    <br />
    <button @click="onClick">Next</button>
  </div>
</template>
<style lang="scss" scoped>
.lesson10 {
  button + button {
    margin-left: 4px;
  }
  .cur-str {
    font-weight: bold;
    color: red;
  }
}
</style>
<script>
function* getNumbers(words) {
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (/^[0-9]+$/.test(word)) {
      yield i;
    }
  }
}

export default {
  data() {
    return {
      string: "30 天精通 RxJS (04)",
      curIndex: -1,
    };
  },
  created() {
    this.iterator = getNumbers(this.string);
  },
  methods: {
    onClick() {
      const result = this.iterator.next();
      if (result.done) {
        this.curIndex = -1;
        this.iterator = getNumbers(this.string);
      } else this.curIndex = result.value;
    },
  },
};
</script>
