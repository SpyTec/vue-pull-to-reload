import { mount } from '@vue/test-utils';
import PullToReload from '../../../src/index';
import { createEvent } from '../utils';

describe('event', () => {
  it('top pull', () => {
    jest.useFakeTimers();
    const wrapper = mount(PullToReload);

    let eTouchStart = createEvent('touchstart', true, true);
    eTouchStart.touches = [{ clientY: 0 }];
    let eTouchMove = createEvent('touchmove', true, true);
    eTouchMove.touches = [{ clientY: 10 }];

    const elem = wrapper.find({ ref: 'scrollContainer' }).element; // vm.$el.querySelector('.vpr-scroll-container');
    elem.dispatchEvent(eTouchStart);
    elem.dispatchEvent(eTouchMove);
    jest.runAllTimers();
    expect(wrapper.emitted('top-pull')).toBeTruthy();
  });

  it('bottom pull', () => {
    jest.useFakeTimers();
    const wrapper = mount(PullToReload);

    let eTouchStart = createEvent('touchstart', true, true);
    eTouchStart.touches = [{ clientY: 0 }];
    let eTouchMove = createEvent('touchmove', true, true);
    eTouchMove.touches = [{ clientY: -30 }];

    const elem = wrapper.find({ ref: 'scrollContainer' }).element;
    elem.dispatchEvent(eTouchStart);
    elem.dispatchEvent(eTouchMove);

    jest.runAllTimers();
    expect(wrapper.emitted('bottom-pull')).toBeTruthy();
  });

  it('top state change', () => {
    jest.useFakeTimers();
    const wrapper = mount(PullToReload, {
      propsData: {
        'topLoadMethod': () => {}
      }
    });

    let eTouchStart = createEvent('touchstart', true, true);
    eTouchStart.touches = [{ clientY: 0 }];
    let eTouchMove = createEvent('touchmove', true, true);
    eTouchMove.touches = [{ clientY: 60 }];

    const elem = wrapper.find({ ref: 'scrollContainer' }).element;
    elem.dispatchEvent(eTouchStart);
    elem.dispatchEvent(eTouchMove);

    jest.runAllTimers();
    expect(wrapper.emitted('top-state-change')).toBeTruthy();
  });

  it('bottom state change', () => {
    const wrapper = mount(PullToReload, {
      propsData: {
        'bottomLoadMethod': () => {}
      }
    });

    let eTouchStart = createEvent('touchstart', true, true);
    eTouchStart.touches = [{ clientY: 0 }];
    let eTouchMove = createEvent('touchmove', true, true);
    eTouchMove.touches = [{ clientY: -60 }];

    const elem = wrapper.find({ ref: 'scrollContainer' }).element;
    elem.dispatchEvent(eTouchStart);
    elem.dispatchEvent(eTouchMove);

    expect(wrapper.emitted('bottom-state-change')).toBeTruthy();
  });

  it('infinite scroll', () => {
    jest.useFakeTimers();
    const wrapper = mount(PullToReload);

    let event = createEvent('scroll', true, true);
    const elem = wrapper.find({ ref: 'scrollContainer' }).element;
    elem.dispatchEvent(event);

    jest.runAllTimers();
    expect(wrapper.emitted('infinite-scroll')).toBeTruthy();
  });

  it('scroll', () => {
    jest.useFakeTimers();
    const wrapper = mount(PullToReload);

    let event = createEvent('scroll', true, true);
    const elem = wrapper.find({ ref: 'scrollContainer' }).element;
    elem.dispatchEvent(event);

    jest.runAllTimers();
    expect(wrapper.emitted('scroll')).toBeTruthy();
  });
});
