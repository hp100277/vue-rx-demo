<template>
  <div class="lesson2">
    <h3>Lesson 2： 创建将数据转化成 Observable 方式</h3>
    <p>字符串：{{ str$ }}</p>
    <p>数组：[ {{ arr$.join("，") }} ]</p>
    <p>对象：{{ obj$.a }}</p>
    <p>布尔值：{{ bool$ }}</p>
    <p>promise：{{ promise$ }}</p>
    <p>interval: {{ interval$ }}</p>
  </div>
</template>
<script>
import { of, interval, from } from "rxjs";
export default {
  domStreams: ["setName$"],
  subscriptions() {
    return {
      str$: of("str"),
      arr$: of([1, 2, 3]),
      obj$: of({
        a: "test-obj",
      }),
      bool$: of(true),
      promise$: from(this.getPromise()),
      interval$: interval(1000),
    };
  },
  methods: {
    getPromise() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("promise");
        }, 5000);
      });
    },
  },
};
</script>
