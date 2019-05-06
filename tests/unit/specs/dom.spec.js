import PullToReload from '../../../src/index';
import { mount } from '@vue/test-utils';

describe('dom', () => {
  let wrapper;
  it('create', () => {
    wrapper = mount(PullToReload);
    expect(wrapper.classes('vpr-wrapper')).toBeTruthy();
    expect(wrapper.find('.vpr-scroll-container').exists()).toBeTruthy();
  });

  it('create action block', () => {
    wrapper = mount(PullToReload, {
      propsData: {
        topLoadMethod: () => {},
        bottomLoadMethod: () => {}
      }
    });
    expect(wrapper.findAll('.vpr-action-block')).toHaveLength(2);
  });

  it('set prop BlockHeight', () => {
    wrapper = mount(PullToReload, {
      propsData: {
        topLoadMethod: () => {},
        bottomLoadMethod: () => {},
        topBlockHeight: 60,
        bottomBlockHeight: 60
      }
    });
    const elems = wrapper.findAll('.vpr-action-block');
    expect(elems.at(0).element.style.height).toEqual('60px');
    expect(elems.at(0).element.style.marginTop).toEqual('-60px');
    expect(elems.at(1).element.style.height).toEqual('60px');
    expect(elems.at(1).element.style.marginBottom).toEqual('-60px');
  });

  it('set wrapperHeight', () => {
    wrapper = mount(PullToReload, {
      propsData: {
        wrapperHeight: '80%'
      }
    });
    expect(wrapper.element.style.height).toEqual('80%');
  });
});
