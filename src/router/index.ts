import * as Vue from 'vue';
import Router from 'vue-router';
declare var require:(resolveArray:Array<any>,resolve:any)=>any;
// can work

// import A from '../components/A.vue';
// import B from '../components/B.vue';

// can work

//when set vue-loader options properties esMolue=true in webpack config it will can't work

const A = (resolve:any) => require(['../components/A.vue'], resolve);
const B = (resolve:any) => require(['../components/B.vue'], resolve);

//can't work

console.info(A);

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'A',
      component:A,
      meta: {
        title: 'A'
      }
    },
    {
      path: '/hello',
      name: 'B',
      component:B,
      meta: {
        title: 'B'
      }
    },
  ]
})

