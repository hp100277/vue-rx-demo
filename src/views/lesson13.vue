<template>
  <div class="lesson13">
    <h3>Lesson 13：Observable Operators</h3>
    <div class="result">
      <p v-if="click.length > 0">
        <span>&nbsp;&nbsp;click:</span>{{ click.join("") }}
      </p>
      <p v-if="source.length > 0">
        <span>&nbsp;source:</span>{{ source.join("") }}
      </p>
      <p style="text-align: center">{{ operator }}</p>
      <p v-if="newest.length > 0">
        <span>&nbsp;newest:</span>{{ newest.join("") }}
      </p>
      <p v-if="example.length > 0">
        <span>example:</span>{{ example.join("") }}
      </p>
    </div>
    <br />
    <br />
    <button @click="onStop">stop</button>
    <br />
    <br />
    <button @click="onMap">map</button>
    <button @click="onMapTo">mapTo</button>
    <button @click="onFilter">filter</button>
    <button @click="onTake">take</button>
    <button @click="onFirst">first</button>
    <br />
    <br />
    <button v-show="!isStartTakeUntil" @click="onStartTakeUntil">
      takeUntil
    </button>
    <button v-show="isStartTakeUntil" ref="btn" @click="onTakeUntil">
      takeUntil
    </button>
    <br />
    <br />
    <button v-show="!isStartTakeUntil" @click="onStartConcatAll">
      concatAll
    </button>
    <button v-show="isStartTakeUntil" ref="btn1">concatAll</button>
  </div>
</template>
<style lang="scss" scoped>
.lesson13 {
}
</style>
<script>
import { fromEvent, interval, of, timer } from "rxjs";
import {
  concatAll,
  filter,
  first,
  map,
  mapTo,
  take,
  takeUntil,
  withLatestFrom,
} from "rxjs/operators";
export default {
  data() {
    return {
      click: [],
      source: [],
      newest: [],
      example: [],
      operator: "",
      separator: "-----",
      isStartTakeUntil: false,
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

    onMap() {
      this.operator = "map((x) => x + 1)";
      this.start(interval(1000).pipe(map((x) => x + 1)));
    },
    onMapTo() {
      this.operator = "mapTo(2)";
      this.start(interval(1000).pipe(mapTo(2)));
    },
    onFilter() {
      this.operator = "filter(x => x % 2 === 0))";
      this.start(
        interval(1000).pipe(filter((x) => x % 2 === 0)),
        ({ separator, source, newest }) => {
          this.source.push(separator || source);
          this.newest.push(separator || newest != source ? "-" : newest);
        }
      );
    },
    onTake() {
      this.operator = "take(3)";
      this.start(
        interval(1000).pipe(take(3)),
        ({ separator, source, newest }) => {
          this.source.push(separator || source);

          if (source < 3) this.newest.push(separator || newest);
        }
      );
    },
    onFirst() {
      this.operator = "first()";
      this.start(
        interval(1000).pipe(first()),
        ({ separator, source, newest }) => {
          this.source.push(separator || source);

          if (source < 1) this.newest.push(separator || newest);
        }
      );
    },
    start(newest$, next) {
      this.reset();

      const source$ = interval(1000);
      this.timer$ = timer(1000, 200)
        .pipe(
          take(50),
          withLatestFrom(source$, newest$),
          map(([value, source, newest]) => {
            return {
              separator: (value + 1) % 5 ? "-" : "",
              source,
              newest,
            };
          })
        )
        .subscribe({
          next: ({ separator, source, newest }) => {
            if (next) {
              next({ separator, source, newest });
            } else {
              this.source.push(separator || source);
              this.newest.push(separator || newest);
            }
          },
          error: () => {
            this.source.push(`X`);
            this.newest.push(`X`);
          },
          complete: () => {
            this.source.push(`|`);
            this.newest.push(`|`);
          },
        });
    },

    onStartTakeUntil() {
      this.unsubscribe();
      this.reset();

      this.operator = "takeUntil(click)";
      this.isStartTakeUntil = true;
      const click$ = fromEvent(this.$refs.btn, "click");

      this.srcInterval$ = interval(1000)
        .pipe(takeUntil(click$))
        .subscribe({
          next: (val) => {
            this.click.push(`${this.separator}-`);
            this.source.push(`${this.separator}${val}`);
            this.example.push(`${this.separator}${val}`);
          },
          error: () => {
            this.source.push(`X`);
            this.example.push(`X`);
          },
          complete: () => {
            // this.source.push(`-click|`);
            this.example.push(`|`);
          },
        });

      this.clickScr$ = click$.subscribe({
        next: () => {
          this.click.push(`--c-`);
        },
      });
    },
    onTakeUntil() {
      this.isStartTakeUntil = false;
    },
    onStartConcatAll() {
      this.unsubscribe();
      this.reset();

      this.operator = "map(e => of(1,2,3))";
      this.isStartTakeUntil = true;
      const click$ = fromEvent(this.$refs.btn1, "click");
      this.exampleSrc$ = click$
        .pipe(
          map(() => of(1, 2, 3)),
          concatAll()
        )
        .subscribe((val) => {
          if (val === 1) this.example.push(`${this.separator}(${val}`);
          else if (val === 3) this.example.push(`${val})`);
          else this.example.push(`${val}`);
        });

      this.clickScr$ = click$.subscribe({
        next: () => {
          this.click.push(
            `${this.click.length > 0 ? "----" : ""}${this.separator}c`
          );
        },
      });
    },
    reset() {
      this.click = [];
      this.source = [];
      this.newest = [];
      this.example = [];
    },
    unsubscribe() {
      if (this.timer$) this.timer$.unsubscribe();

      this.isStartTakeUntil = false;

      if (this.exampleSrc$) this.exampleSrc$.unsubscribe();
      if (this.clickScr$) this.clickScr$.unsubscribe();
      if (this.srcInterval$) this.srcInterval$.unsubscribe();
      if (this.newestInterval$) this.newestInterval$.unsubscribe();
    },
    subscribe(newest$, next) {
      this.unsubscribe();
      this.reset();
      this.srcInterval$ = interval(1000)
        .pipe(take(9))
        .subscribe({
          next: (val) => {
            this.source.push(`${this.separator}${val}`);
          },
          error: () => {
            this.source.push(`X`);
          },
          complete: () => {
            this.source.push(`|`);
          },
        });

      this.newestInterval$ = newest$.subscribe({
        next: (val) => {
          if (next) next(val);
          else this.newest.push(`${this.separator}${val}`);
        },
        error: () => {
          this.newest.push(`X`);
        },
        complete: () => {
          this.newest.push(`|`);
        },
      });
    },
  },
};
</script>
