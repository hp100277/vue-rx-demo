<template>
  <div class="lesson1">
    <h3>Lesson 1：</h3>
    <span>更新时间：{{ info$.time }}</span>
    <br />
    <br />
    <span>姓名：{{ info$.name }}</span>
    <br />
    <br />
    <span>年龄：{{ age$ }}</span>
    <br />
    <br />
    <br />
    <button v-stream:click="setInfo$">设置</button>
    <button @click="onClick">延迟运算 Next</button>
  </div>
</template>
<style lang="scss" scoped>
.lesson1 {
  button + button {
    margin-left: 4px;
  }
}
</style>
<script>
import { of } from "rxjs";
import { map, startWith, take } from "rxjs/operators";
export default {
  created() {
    function* getNumbers(words) {
      for (let word of words) {
        console.log(word);
        if (/^[0-9]+$/.test(word)) {
          yield parseInt(word, 10);
        }
      }
    }
    this.iterator = getNumbers("30 天精通 RxJS (04)");
  },
  domStreams: ["setInfo$"],
  subscriptions() {
    return {
      age$: of(23).pipe(map((data) => data)),
      info$: this.setInfo$.pipe(
        map(() => ({
          time: new Date().getTime(),
          name: "hello~~",
        })),
        take(1),
        startWith({
          time: "",
          name: "",
        })
      ),
    };
  },
  methods: {
    onClick() {
      console.log(this.iterator.next());
    },
  },
};
</script>
<style lang="scss">
.lesson1 {
}
</style>
