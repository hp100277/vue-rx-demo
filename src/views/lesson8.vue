<template>
  <div class="lesson8">
    <h3>Lesson 8：自定义组件事件处理</h3>
    <div>{{ count$ }}</div>
    <!-- simple usage -->
    <button v-stream:click="plus$">Plus</button>
    <button
      v-stream:click="{
        subject: plus$,
        options: { once: true },
      }"
    >
      Plus：Once
    </button>
    <my-button v-stream:click="plus$"></my-button>
    <br />
    <br />
    <!-- you can also stream to the same subject with different events/data -->
    <button
      v-stream:click="{ subject: minus$, data: minusDelta1 }"
      v-stream:mousemove="{ subject: minus$, data: minusDelta2 }"
    >
      Minus：Click or Mousemove
    </button>
  </div>
</template>
<style lang="scss" scoped>
button + button {
  margin-left: 4px;
}
</style>
<script>
import { merge } from "rxjs";
import { map, pluck, scan, startWith } from "rxjs/operators";
export default {
  data() {
    return {
      minusDelta1: -1,
      minusDelta2: -2,
    };
  },
  components: {
    myButton: {
      template: `<button @click="$emit('click')">My Plus Button</button>`,
    },
  },
  domStreams: ["plus$", "minus$"],
  subscriptions() {
    return {
      count$: merge(
        this.plus$.pipe(map(() => 1)),
        this.minus$.pipe(pluck("data"))
      ).pipe(
        startWith(0),
        scan((total, change) => total + change)
      ),
    };
  },
};
</script>
