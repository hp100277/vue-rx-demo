<template>
  <div class="lesson16">
    <h3>Lesson 16：Observable Operators</h3>
    <div class="result">
      <p v-if="source.length > 0">
        <span>&nbsp;source:</span>{{ source.join("") }}
      </p>
      <p v-if="newest.length > 0">
        <span>&nbsp;newest:</span>{{ newest.join("") }}
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
    <button @click="onCombineLatest">combineLatest</button>
    <button @click="onZip">zip(x + y)</button>
    <button @click="onZipY">zip(y)</button>
    <button @click="onWithLatestFrom">withLatestFrom</button>
  </div>
</template>
<style lang="scss" scoped>
.lesson16 {
}
</style>
<script>
import { combineLatest, from, interval, zip } from "rxjs";
import { map, take, withLatestFrom } from "rxjs/operators";
import { watch } from "rxjs-watcher";
export default {
  data() {
    return {
      source: [],
      newest: [],
      example: [],
      operator: "",
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
    onCombineLatest() {
      this.operator = "combineLatest(newest, (x, y) => x + y)";
      const source$ = interval(500).pipe(take(3));
      const newest$ = interval(300).pipe(take(6));
      this.subscrible({
        source$,
        newest$,
        example$: combineLatest(source$, newest$).pipe(
          map(([source, newest]) => `(${source}+${newest})`)
        ),
      });
    },
    onZip() {
      this.operator = "zip(newest, (x, y) => x + y)";
      const source$ = interval(500).pipe(take(3));
      const newest$ = interval(300).pipe(take(6));

      // zip(source$, newest$)
      //   .pipe(map(([source, newest]) => `(${source}+${newest})`))
      //   .subscribe((val) => {
      //     console.log(val);
      //   });

      this.subscrible({
        source$,
        newest$,
        example$: zip(source$, newest$).pipe(
          map(([source, newest]) => `(${source}+${newest})`)
        ),
      });
    },
    onZipY() {
      this.unsubscribe();
      this.reset();
      this.operator = "zip(newest, (x, y) =>  y)";
      const source$ = from("hello");
      const newest$ = interval(100).pipe(take(9));
      const example$ = zip(source$, newest$).pipe(
        map(([source]) => `${source}`)
      );

      this.sourceInterval$ = source$.subscribe({
        next: (val) => {
          this.source.push(`--${val}`);
        },
        complete: () => {
          this.source.push(`|`);
        },
      });

      this.newestInterval$ = newest$.subscribe({
        next: (val) => {
          this.newest.push(`--${val}`);
        },
        complete: () => {
          this.newest.push(`|`);
        },
      });

      this.exampleInterval$ = example$.subscribe({
        next: (val) => {
          this.example.push(`--${val}`);
        },
        complete: () => {
          this.example.push(`|`);
        },
      });
    },
    onWithLatestFrom() {
      this.unsubscribe();
      this.reset();
      this.operator =
        "withLatestFrom(some, (x, y) =>  y === 1 ? x.toUpperCase() : x)";
      const source$ = zip(from("hello"), interval(500)).pipe(map(([x]) => x));
      const newest$ = zip(from([1, 0, 1, 0, 0, 0, 1]), interval(300)).pipe(
        map(([x]) => x)
      );
      const example$ = source$.pipe(
        withLatestFrom(newest$),
        map(([x, y]) => {
          return y === 1 ? x.toUpperCase() : x;
        }),
        watch("withLatestFrom", 5)
      );

      this.sourceInterval$ = source$.subscribe({
        next: (val) => {
          this.source.push(`-----${val}`);
        },
        complete: () => {
          this.source.push(`|`);
        },
      });

      this.newestInterval$ = newest$.subscribe({
        next: (val) => {
          this.newest.push(`---${val}`);
        },
        complete: () => {
          this.newest.push(`|`);
        },
      });

      this.exampleInterval$ = example$.subscribe({
        next: (val) => {
          this.example.push(`--${val}`);
        },
        complete: () => {
          this.example.push(`|`);
        },
      });
    },
    reset() {
      this.source = [];
      this.newest = [];
      this.example = [];
    },
    unsubscribe() {
      if (this.sourceInterval$) this.sourceInterval$.unsubscribe();
      if (this.newestInterval$) this.newestInterval$.unsubscribe();
      if (this.exampleInterval$) this.exampleInterval$.unsubscribe();
    },
    subscrible({ source$, newest$, example$ }) {
      this.unsubscribe();
      this.reset();
      this.sourceInterval$ = source$.subscribe({
        next: (val) => {
          this.source.push(`-----${val}`);
        },
        complete: () => {
          this.source.push(`|`);
        },
      });

      this.newestInterval$ = newest$.subscribe({
        next: (val) => {
          this.newest.push(`---${val}`);
        },
        complete: () => {
          this.newest.push(`|`);
        },
      });

      this.exampleInterval$ = example$.subscribe({
        next: (val) => {
          this.example.push(`--${val}`);
        },
        complete: () => {
          this.example.push(`|`);
        },
      });
    },
  },
};
</script>
