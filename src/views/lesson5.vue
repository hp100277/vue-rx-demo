<template>
  <div class="lesson5">
    <h3>Lesson 5：输入框中获取值</h3>
    <input type="text" v-stream:keyup="getInput$" />
    <p>{{ value$ }}</p>
  </div>
</template>
<script>
import { from } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  pluck,
  switchMap,
} from "rxjs/operators";
export default {
  domStreams: ["getInput$"],
  subscriptions() {
    return {
      value$: this.getInput$.pipe(
        pluck("event", "target", "value"),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((val) => from(this.test(val)))
      ),
    };
  },
  methods: {
    test(val) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(`request params: ${val}`);
        }, 1000);
      });
    },
  },
};
</script>
