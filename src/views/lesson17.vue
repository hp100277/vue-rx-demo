<template>
  <div class="lesson17">
    <h3>Lesson 17：Player</h3>
    <div ref="anchor" class="anchor">
      <div ref="video" class="video" :class="{ 'video-fixed': isBottom }">
        <div class="masker"></div>
        <video src="#" width="100%"></video>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.lesson17 {
  height: 2000px;
  position: relative;
  .anchor {
    height: 360px;
    width: 100%;
    background-color: #f0f0f0;

    .video {
      width: 640px;
      height: 360px;
      margin: 0 auto;
      background-color: black;
      &.video-fixed {
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 320px;
        height: 150px;
        cursor: all-scroll;
        .masker {
          display: none;
        }
        &:hover {
          .masker {
            display: block;
            position: absolute;
            width: 100%;
            height: 180px;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 2;
          }
        }
      }
    }
  }
}
</style>
<script>
import { fromEvent } from "rxjs";
import {
  concatAll,
  filter,
  map,
  takeUntil,
  withLatestFrom,
} from "rxjs/operators";
export default {
  data() {
    return {
      isBottom: false,
    };
  },
  mounted() {
    const { anchor, video } = this.$refs;
    const scroll$ = fromEvent(document, "scroll");
    const mouseDown$ = fromEvent(video, "mousedown");
    const mouseUp$ = fromEvent(document, "mouseup");
    const mouseMove$ = fromEvent(document, "mousemove");

    const validValue = (value, max, min) => {
      return Math.min(Math.max(value, min), max);
    };
    scroll$
      .pipe(map(() => anchor.getBoundingClientRect().bottom < 0))
      .subscribe((result) => {
        this.isBottom = result;
        if (!result) {
          video.style.right = `10px`;
          video.style.bottom = `10px`;
        }
      });

    mouseDown$
      .pipe(
        filter(() => this.isBottom),
        map(() => mouseMove$.pipe(takeUntil(mouseUp$))),
        concatAll(),
        withLatestFrom(mouseDown$, (move, down) => {
          return {
            x: validValue(
              window.innerWidth - (move.clientX - down.offsetX) - 320,
              window.innerWidth,
              10
            ),
            y: validValue(
              window.innerHeight - (move.clientY - down.offsetY) - 160,
              window.innerHeight,
              10
            ),
          };
        })
      )
      .subscribe((pos) => {
        video.style.right = `${pos.x}px`;
        video.style.bottom = `${pos.y}px`;
      });
  },
};
</script>
