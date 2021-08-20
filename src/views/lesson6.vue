<template>
  <div class="lesson6">
    <h3>Lesson 6：多源合计运算</h3>
    <div>{{ count$ }}</div>
    <button v-on:click="plus(10)">Plus 10</button>
    <button v-on:click="minus(-1)">Minus 1</button>
  </div>
</template>
<style lang="scss" scoped>
button + button {
  margin-left: 4px;
}
</style>
<script>
import { merge, interval } from "rxjs";
import { scan, startWith } from "rxjs/operators";
export default {
  created() {
    interval(1800).subscribe(() => {
      this.plus(4);
    });

    interval(400).subscribe(() => {
      this.minus(-1);
    });
  },
  observableMethods: {
    plus: "plus$",
    minus: "minus$",
  },
  subscriptions() {
    return {
      count$: merge(this.plus$, this.minus$).pipe(
        scan((total, change) => total + change),
        startWith(0)
      ),
    };
  },
};
</script>
