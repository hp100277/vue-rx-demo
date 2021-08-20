<template>
  <div class="lesson14">
    <h3>Lesson 14：简易拖拉</h3>
    <div ref="container" class="container-box">
      <div ref="dragBox" class="drag-box"></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container-box {
  position: relative;
  display: inline-block;
  width: 400px;
  height: 300px;
  background-color: #000;
  .drag-box {
    position: absolute;
    left: 0;
    top: 0;
    height: 40px;
    width: 40px;
    background-color: #ffffffa4;
    cursor: pointer;
  }
}
</style>
<script>
import { fromEvent } from "rxjs";
import { concatAll, map, takeUntil } from "rxjs/operators";
export default {
  mounted() {
    const { dragBox, container } = this.$refs;
    const mouseDown$ = fromEvent(dragBox, "mousedown");
    const mouseUp$ = fromEvent(container, "mouseup");
    const mouseMove$ = fromEvent(container, "mousemove");
    mouseDown$
      .pipe(
        map(() => mouseMove$.pipe(takeUntil(mouseUp$))),
        concatAll(),
        map((m) => ({
          x: m.clientX - container.offsetLeft,
          y: m.clientY - container.offsetTop,
        }))
      )
      .subscribe((pos) => {
        dragBox.style.left = `${pos.x}px`;
        dragBox.style.top = `${pos.y}px`;
      });
  },
};
</script>
