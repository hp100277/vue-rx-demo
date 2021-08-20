<template>
  <div class="lesson11">
    <h3>Lesson 11：建立 Observable(一)</h3>
    <p>
      <span class="str" v-for="(word, index) in words" :key="index">
        {{ word }}
      </span>
    </p>
    <button @click="onCrateObserverable">建立 Observable: create</button>
    <button @click="onCrateObserver">观察者 Observer</button>
  </div>
</template>
<style lang="scss" scoped>
.lesson11 {
  button + button {
    margin-left: 4px;
  }
}
</style>
<script>
import { Observable } from "rxjs";
export default {
  data() {
    return {
      words: [],
    };
  },

  methods: {
    onCrateObserverable() {
      this.words = [];
      this.words.push("[start]");
      const observable = Observable.create((observer) => {
        observer.next("Hello");
        observer.next("RxJx");
        setTimeout(() => {
          observer.next("6!!");
        }, 0);
      });

      observable.subscribe((value) => {
        this.words.push(value);
      });
      this.words.push("[end]");
    },
    onCrateObserver() {
      this.words = [];
      const observable = Observable.create((observer) => {
        try {
          observer.next("Hello");
          observer.next("RxJx");
          throw "some exception";
          //   observer.complete();
          //   observer.next("6!!");
        } catch (e) {
          observer.error(e);
        }
      });

      observable.subscribe({
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
