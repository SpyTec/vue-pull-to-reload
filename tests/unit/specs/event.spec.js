import { mount } from '@vue/test-utils';
import PullToReload from '../../../src/index';

describe('event', () => {
  it('top pull', (done) => {
    jest.useFakeTimers();
    let res;
    const wrapper = mount(PullToReload);

    let eTouchStart = createEvent('touchstart', true, true);
    eTouchStart.touches = [{ clientY: 0 }];
    let eTouchMove = createEvent('touchmove', true, true);
    eTouchMove.touches = [{ clientY: 10 }];

    const elem = wrapper.find({ ref: 'scrollContainer' }); // vm.$el.querySelector('.vpr-scroll-container');
    elem.dispatchEvent(eTouchStart);
    elem.dispatchEvent(eTouchMove);
    jest.runAllTimers();
  });

  it('bottom pull', (done) => {
    let res;
    const vm = createVue({
      template: `
         <div style="height: 500px">
          <pull-to @bottom-pull="onBottomPull"><div></div></pull-to>
        </div>
      `,
      components: { PullToReload },
      methods: {
        onBottomPull (e) {
          res = e;
        }
      }
    }, true);

    let eTouchStart = createEvent('touchstart', true, true);
    eTouchStart.touches = [{ clientY: 0 }];
    let eTouchMove = createEvent('touchmove', true, true);
    eTouchMove.touches = [{ clientY: -30 }];

    const elem = vm.$el.querySelector('.vpr-scroll-container');
    elem.dispatchEvent(eTouchStart);
    elem.dispatchEvent(eTouchMove);

    setTimeout(() => {
      expect(res).to.be.exist;
      done();
    }, 350);
  });

  it('top state change', (done) => {
    let res;
    const vm = createVue({
      template: `
         <div style="height: 500px">
          <pull-to @top-state-change="onTopStateChange" :top-load-method="onTopLoadMethod"><div></div></pull-to>
        </div>
      `,
      components: { PullToReload },
      methods: {
        onTopLoadMethod () {},
        onTopStateChange (e) {
          res = e;
        }
      }
    }, true);

    let eTouchStart = createEvent('touchstart', true, true);
    eTouchStart.touches = [{ clientY: 0 }];
    let eTouchMove = createEvent('touchmove', true, true);
    eTouchMove.touches = [{ clientY: 60 }];

    const elem = vm.$el.querySelector('.vpr-scroll-container');
    elem.dispatchEvent(eTouchStart);
    elem.dispatchEvent(eTouchMove);

    setTimeout(() => {
      expect(res).to.be.exist;
      done();
    }, 20);
  });

  it('bottom state change', (done) => {
    let res;
    const vm = createVue({
      template: `
         <div style="height: 500px">
          <pull-to @bottom-state-change="onBottomStateChange" :bottom-load-method="onBottomLoadMethod"><div></div></pull-to>
        </div>
      `,
      components: { PullToReload },
      methods: {
        onBottomLoadMethod () {},
        onBottomStateChange (e) {
          res = e;
        }
      }
    }, true);

    let eTouchStart = createEvent('touchstart', true, true);
    eTouchStart.touches = [{ clientY: 0 }];
    let eTouchMove = createEvent('touchmove', true, true);
    eTouchMove.touches = [{ clientY: -60 }];

    const elem = vm.$el.querySelector('.vpr-scroll-container');
    elem.dispatchEvent(eTouchStart);
    elem.dispatchEvent(eTouchMove);

    setTimeout(() => {
      expect(res).to.be.exist;
      done();
    }, 20);
  });

  it('infinite scroll', (done) => {
    let res = false;
    const vm = createVue({
      template: `
         <div style="height: 500px">
          <pull-to @infinite-scroll="onInfiniteScroll"><div></div></pull-to>
        </div>
      `,
      components: { PullToReload },
      methods: {
        onInfiniteScroll (e) {
          res = true;
        }
      }
    }, true);

    let event = createEvent('scroll', true, true);
    const elem = vm.$el.querySelector('.vpr-scroll-container');
    elem.dispatchEvent(event);

    setTimeout(() => {
      expect(res).to.be.ok;
      done();
    }, 420);
  });

  it('scroll', (done) => {
    let res;
    const vm = createVue({
      template: `
         <div style="height: 500px">
          <pull-to @scroll="onScroll"><div></div></pull-to>
        </div>
      `,
      components: { PullToReload },
      methods: {
        onScroll (e) {
          res = e;
        }
      }
    }, true);

    let event = createEvent('scroll', true, true);
    const elem = vm.$el.querySelector('.vpr-scroll-container');
    elem.dispatchEvent(event);

    setTimeout(() => {
      expect(res).to.exist();
      done();
    }, 200);
  });
});
