<template>
  <div class="lesson4">
    <h3>Lesson 4：事件中传递参数</h3>
    <ul>
      <li
        v-for="(txt, index) in texts"
        :key="index"
        v-stream:click="{
          subject: getText$,
          data: {
            index,
            txt,
          },
        }"
      >
        {{ txt }}
      </li>
    </ul>
    <p>点击的数字为：{{ txt$.txt }}</p>
    <p>点击的数字下标为：{{ txt$.index }}</p>
  </div>
</template>
<script>
import { pluck, startWith } from "rxjs/operators";
export default {
  data() {
    return {
      texts: ["Hello", "RxJs", "6"],
    };
  },
  domStreams: ["getText$"],
  subscriptions() {
    return {
      txt$: this.getText$.pipe(
        pluck("data"),
        startWith({
          txt: "【未选择】",
          index: -1,
        })
      ),
    };
  },
};
</script>
