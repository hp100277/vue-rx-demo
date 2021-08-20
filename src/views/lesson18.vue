<template>
  <div class="lesson13">
    <h3>Lesson 18：Observable Operators</h3>
    <div class="result"></div>
    <br />
    <br />
    <button @click="onStop">stop</button>
    <br />
    <br />
    <button @click="onBuffer">buffer</button>
    <button @click="onBufferCount">bufferCount</button>
  </div>
</template>
<script>
import { interval, merge } from "rxjs";
import { buffer, bufferCount, map } from "rxjs/operators";
export default {
  data() {
    return {};
  },
  methods: {
    onStop() {
      merge(
        interval(200).pipe(map((val) => ({ x: val }))),
        interval(1000).pipe(map((val) => ({ y: val })))
      )
        // .pipe(map(([x, y]) => ({ x, y })))
        .subscribe((val) => {
          console.log(val);
        });
    },
    onBuffer() {
      const src$ = interval(300);
      const src2$ = interval(1000);

      src$.pipe(buffer(src2$)).subscribe({
        next: (value) => {
          console.log(value);
        },
        error: (err) => {
          console.log("Error: " + err);
        },
        complete: () => {
          console.log("complete");
        },
      });
    },
    onBufferCount() {
      const src$ = interval(300);

      src$.pipe(bufferCount(4)).subscribe({
        next: (value) => {
          console.log(value);
        },
        error: (err) => {
          console.log("Error: " + err);
        },
        complete: () => {
          console.log("complete");
        },
      });
    },
  },
};
</script>
