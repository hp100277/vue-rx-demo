<template>
  <div class="lesson7">
    <h3>Lesson 7：多源合计运算（简化写法：v-stream）</h3>
    <div>{{ count$ }}</div>
    <button
      v-stream:click="{
        subject: plus$,
        data: 10,
      }"
    >
      Plus 10
    </button>
    <button
      v-stream:click="{
        subject: minus$,
        data: -1,
      }"
    >
      Minus 1
    </button>
  </div>
</template>
<style lang="scss" scoped>
button + button {
  margin-left: 4px;
}
</style>
<script>
import { merge, interval } from "rxjs";
import { pluck, scan, startWith } from "rxjs/operators";
export default {
  created() {
    interval(1800).subscribe(() => {
      this.plus$.next({ data: 4 });
    });
    interval(400).subscribe(() => {
      this.minus$.next({ data: -1 });
    });
  },
  domStreams: ["plus$", "minus$"],
  subscriptions() {
    return {
      count$: merge(
        this.plus$.pipe(pluck("data")),
        this.minus$.pipe(pluck("data"))
      ).pipe(
        scan((total, change) => {
          return total + change;
        }),
        startWith(0)
      ),
    };
  },
};
</script>
