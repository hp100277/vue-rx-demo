<template>
  <div class="lesson12">
    <h3>Lesson 12：建立 Observable(二)</h3>
    <p>
      {{ words.join("，") }}
    </p>
    <button @click="onOf">of</button>
    <button @click="onFrom">from</button>
    <button @click="onFromPromise">from promise</button>
    <button ref="btn">from event</button>
    <button ref="btn1">from event pattem</button>
    <br />
    <br />
    <button @click="onEmpty">empty</button>
    <button @click="onNever">never</button>
    <button @click="onThrowError">throw error</button>
    <br />
    <br />
    <button @click="onInterval">interval</button>
    <button @click="onTimer">timer</button>
  </div>
</template>
<style lang="scss" scoped>
.lesson12 {
  button + button {
    margin-left: 4px;
  }
}
</style>
<script>
import {
  EMPTY,
  from,
  fromEvent,
  fromEventPattern,
  interval,
  NEVER,
  of,
  throwError,
  timer,
} from "rxjs";
import { pluck } from "rxjs/operators";
export default {
  data() {
    return {
      words: [],
    };
  },
  mounted() {
    this.subscribe(
      fromEvent(this.$refs.btn, "click").pipe(pluck("target", "innerText"))
    );

    this.subscribe(
      fromEventPattern(
        (handler) => {
          this.$refs.btn1.addEventListener("click", handler);
        },
        (handler) => {
          this.$refs.btn1.removeEventListener("click", handler);
        }
      ).pipe(pluck("target", "innerText"))
    );
  },
  methods: {
    onOf() {
      this.subscribe(of("Hello", "RxJs", "6!!"));
    },
    onFrom() {
      this.subscribe(from(["Hello", "RxJs", "6!!", 2021]));
    },
    onFromPromise() {
      this.subscribe(
        from(
          new Promise((resolve) => {
            this.words.push("[start]");
            setTimeout(() => {
              resolve("Hello RxJs!!");
            }, 3000);
          })
        )
      );
    },
    onEmpty() {
      this.subscribe(EMPTY);
    },
    onNever() {
      this.subscribe(NEVER);
    },
    onThrowError() {
      this.subscribe(throwError("throw error!!"));
    },
    onInterval() {
      this.interval$ = this.subscribe(interval(1000));
    },
    onTimer() {
      this.timer$ = this.subscribe(timer(1000, 3000));
    },
    subscribe(observable) {
      this.words = [];
      if (this.timer$) this.timer$.unsubscribe();
      if (this.interval$) this.interval$.unsubscribe();
      return observable.subscribe({
        next: (value) => {
          this.words.push(value);
        },
        error: (err) => {
          this.words.push(`[err]:${err}`);
        },
        complete: () => {
          this.words.push("[complete]");
        },
      });
    },
  },
};
</script>
