<template>
  <div class="lesson15">
    <h3>Lesson 15：Observable Operators</h3>
    <div class="result">
      <p v-if="source.length > 0">
        <span>&nbsp;source:</span>{{ source.join("") }}
      </p>
      <p style="text-align: center">{{ operator }}</p>
      <p v-if="example.length > 0">
        <span>example:</span>{{ example.join("") }}
      </p>
    </div>
    <br />
    <br />
    <button @click="onStop">stop</button>
    <br />
    <br />
    <button @click="onSkip">skip(3)</button>
    <button @click="onTakeLast">takeLast(2)</button>
    <button @click="onLast">last()</button>
  </div>
</template>
<style lang="scss" scoped>
.lesson15 {
}
</style>
<script>
import { interval } from "rxjs";
import { last, skip, take, takeLast } from "rxjs/operators";

export default {
  data() {
    return {
      source: [],
      example: [],
      operator: "",
      separator: "-----",
    };
  },
  created() {
    this.operator = "Not Started";
    this.reset();
  },
  methods: {
    onStop() {
      this.unsubscribe();
    },
    onSkip() {
      this.operator = "skip(3)";
      this.subscribe(interval(1000).pipe(take(9), skip(3)), {
        srcNext: (val) => {
          this.source.push(`${this.separator}${val}`);
          if (val < 3) this.example.push(`${this.separator}-`);
        },
      });
    },
    onTakeLast() {
      this.operator = "takeLast(2)";
      this.subscribe(interval(1000).pipe(take(9), takeLast(2)), {
        srcNext: (val) => {
          this.source.push(`${this.separator}${val}`);
          this.example.push(`${this.separator}-`);
        },
        expNext: (val) => {
          this.example.push(val);
        },
      });
    },
    onLast() {
      this.operator = "last()";
      this.subscribe(interval(1000).pipe(take(9), last()), {
        srcNext: (val) => {
          this.source.push(`${this.separator}${val}`);
          this.example.push(`${this.separator}-`);
        },
        expNext: (val) => {
          this.example.push(val);
        },
      });
    },
    reset() {
      this.source = [];
      this.example = [];
    },
    unsubscribe() {
      this.isStartTakeUntil = false;

      if (this.srcInterval$) this.srcInterval$.unsubscribe();
      if (this.expInterval$) this.expInterval$.unsubscribe();
    },
    subscribe(expInterval$, { srcNext, expNext }) {
      this.unsubscribe();
      this.reset();
      this.srcInterval$ = interval(1000)
        .pipe(take(9))
        .subscribe({
          next: (val) => {
            if (srcNext) srcNext(val);
            else this.source.push(`${this.separator}${val}`);
          },
          error: () => {
            this.source.push(`X`);
          },
          complete: () => {
            this.source.push(`|`);
          },
        });

      this.expInterval$ = expInterval$.subscribe({
        next: (val) => {
          if (expNext) expNext(val);
          else this.example.push(`${this.separator}${val}`);
        },
        error: () => {
          this.example.push(`X`);
        },
        complete: () => {
          this.example.push(`|`);
        },
      });
    },
  },
};
</script>
