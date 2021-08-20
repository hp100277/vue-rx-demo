<template>
  <div class="lesson9">
    <h3>Lesson 9： 各种 map 方法在 promise 中的运用</h3>
    <p>耗时：{{ time }} 秒</p>
    <p>结果：{{ result$.join("，") }}</p>

    <button v-stream:click="{ subject: onClick$, data: 'concatMap' }">
      concatMap
    </button>
    <button v-stream:click="{ subject: onClick$, data: 'switchMap' }">
      switchMap
    </button>
    <button v-stream:click="{ subject: onClick$, data: 'exhaustMap' }">
      exhaustMap
    </button>
  </div>
</template>
<style lang="scss" scoped>
.lesson9 {
  button + button {
    margin-left: 4px;
  }
}
</style>
<script>
import {
  concatMap,
  exhaustMap,
  switchMap,
  pluck,
  startWith,
  reduce,
} from "rxjs/operators";
import { from, of } from "rxjs";
export default {
  data() {
    return { time: 0 };
  },
  domStreams: ["onClick$"],
  subscriptions() {
    return {
      result$: this.onClick$.pipe(
        pluck("data"),
        exhaustMap((val) => {
          let of$;
          let map;
          if (val === "concatMap") {
            of$ = from([this.test1, this.test2, this.test3]);
            map = concatMap((test) => test().catch((err) => err));
          } else if (val === "switchMap") {
            of$ = of(this.test1, this.test2, this.test3);
            map = switchMap((test) => test().catch((err) => err));
          } else if (val === "exhaustMap") {
            of$ = of(this.test2, this.test1, this.test3);
            map = exhaustMap((test) => test().catch((err) => err));
          }

          const startTime = new Date().getTime();
          const result$ = of$.pipe(
            map,
            reduce((acc, cur) => [...acc, cur], [])
          );

          result$.subscribe((val) => {
            console.log(val);
            const endTime = new Date().getTime();

            this.time = Math.round((endTime - startTime) / 1000);
          });

          return result$;
        }),
        startWith([])
      ),
    };
  },
  methods: {
    test1() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("test1 success");
        }, 1000);
      });
    },
    test2() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject("test2 fail");
        }, 3000);
      });
    },
    test3() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("test3 success");
        }, 2000);
      });
    },
  },
};
</script>
