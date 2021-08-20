import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [{ path: "/", redirect: "/lesson1" }];

for (let i = 0; i < 20; i++) {
  routes.push({
    lessonName: `Lesson ${i + 1}`,
    path: `/lesson${i + 1}`,
    component: () =>
      import(/* webpackChunkName: "[request]" */ `../views/lesson${i + 1}.vue`),
  });
}

const router = new VueRouter({
  routes,
});

export default router;
