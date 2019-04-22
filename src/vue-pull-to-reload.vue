<template>
  <div class="vpr-wrapper"
       :style="{ height: wrapperHeight, position: 'absolute', marginTop: `${diff}px`}">
    <div v-if="topLoadMethod"
         :style="{ height: `${topBlockHeight}px`, marginTop: `${-topBlockHeight}px` }"
         class="vpr-action-block">
      <slot name="top-block"
            :state="state"
            :state-text="topText"
            :trigger-distance="_topConfig.triggerDistance"
            :diff="diff">
        <p class="vpr-default-text">{{ topText }}</p>
      </slot>
    </div>
    <div class="vpr-scroll-container" ref="scrollContainer">
      <slot></slot>
    </div>
    <div v-if="bottomLoadMethod"
         :style="{ height: `${bottomBlockHeight}px`, marginBottom: `${-bottomBlockHeight}px` }"
         class="vpr-action-block">
      <slot name="bottom-block"
            :state="state"
            :state-text="bottomText"
            :trigger-distance="_bottomConfig.triggerDistance"
            :diff="diff">
        <p class="vpr-default-text">{{ bottomText }}</p>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { throttle } from './utils';
import { TOP_DEFAULT_CONFIG, BOTTOM_DEFAULT_CONFIG } from './config';

@Component({
  name: 'vue-pull-to-reload'
})
export default class VuePullToReload extends Vue {
  @Prop({ type: Number, default: 2 }) readonly distanceIndex!: number;
  @Prop({ type: Number, default: 50 }) readonly topBlockHeight!: number;
  @Prop({ type: Number, default: 50 }) readonly bottomBlockHeight!: number;
  @Prop({ type: String, default: '100%' }) readonly wrapperHeight!: string;
  @Prop({ type: Function }) readonly topLoadMethod!: Function;
  @Prop({ type: Function }) readonly bottomLoadMethod!: Function;
  @Prop({ type: Boolean, default: true }) readonly isThrottleTopPull!: boolean;
  @Prop({ type: Boolean, default: true }) readonly isThrottleBottomPull!: boolean;
  @Prop({ type: Boolean, default: true }) readonly isThrottleScroll!: boolean;
  @Prop({ type: Boolean, default: true }) readonly isTopBounce!: boolean;
  @Prop({ type: Boolean, default: true }) readonly isBottomBounce!: boolean;
  @Prop({ type: Object, default: () => {} }) readonly topConfig!: object;
  @Prop({ type: Object, default: () => {} }) readonly bottomConfig!: object;
  scrollEl!: HTMLElement;
  startScrollTop = 0;
  startY = 0;
  startX = 0;
  currentY = 0;
  currentX = 0;
  distance = 0;
  direction = '';
  diff = 0;
  beforeDiff = 0;
  topText = '';
  bottomText = '';
  state = '';
  bottomReached = false;
  /*  throttleEmitTopPull:Function|null = null;
  throttleEmitBottomPull:Function|null = null;
  throttleEmitScroll:Function|null = null;
  throttleOnInfiniteScroll:Function|null = null; */

  throttleEmitTopPull = this.throttleEmit(200, 300, 'top-pull');
  throttleEmitBottomPull = this.throttleEmit(200, 300, 'bottom-pull');
  throttleEmitScroll = this.throttleEmit(100, 150, 'scroll');
  throttleOnInfiniteScroll = throttle(this.onInfiniteScroll, 400);

  get _topConfig () {
    return Object.assign({}, TOP_DEFAULT_CONFIG, this.topConfig);
  };

  get _bottomConfig () {
    return Object.assign({}, BOTTOM_DEFAULT_CONFIG, this.bottomConfig);
  }
  @Watch('state')
  onStateChange (val: string) {
    if (this.direction === 'down') {
      this.$emit('top-state-change', val);
    } else {
      this.$emit('bottom-state-change', val);
    }
  }
  actionPull () {
    this.state = 'pull';
    this.direction === 'down'
      ? this.topText = this._topConfig.pullText
      : this.bottomText = this._bottomConfig.pullText;
  };
  actionTrigger () {
    this.state = 'trigger';
    this.direction === 'down'
      ? this.topText = this._topConfig.triggerText
      : this.bottomText = this._bottomConfig.triggerText;
  };
  actionLoading () {
    this.state = 'loading';
    if (this.direction === 'down') {
      this.topText = this._topConfig.loadingText;
      /* eslint-disable no-useless-call */
      this.topLoadMethod.call(this, this.actionLoaded);
      this.scrollTo(this._topConfig.stayDistance);
    } else {
      this.bottomText = this._bottomConfig.loadingText;
      this.bottomLoadMethod.call(this, this.actionLoaded);
      this.scrollTo(-this._bottomConfig.stayDistance);
    }
  };
  actionLoaded (loadState = 'done') {
    this.state = `loaded-${loadState}`;
    let loadedStayTime;
    if (this.direction === 'down') {
      this.topText = loadState === 'done'
        ? this._topConfig.doneText
        : this._topConfig.failText;
      loadedStayTime = this._topConfig.loadedStayTime;
    } else {
      this.bottomText = loadState === 'done'
        ? this._bottomConfig.doneText
        : this._bottomConfig.failText;
      loadedStayTime = this._bottomConfig.loadedStayTime;
    }
    setTimeout(() => {
      this.scrollTo(0);

      // reset state
      setTimeout(() => {
        this.state = '';
      }, 200);
    }, loadedStayTime);
  };
  scrollTo (y: number, duration: number = 200) {
    // @ts-ignore
    this.$el.style.transition = `${duration}ms`;
    this.diff = y;
    setTimeout(() => {
      // @ts-ignore
      this.$el.style.transition = '';
    }, duration);
  };

  checkBottomReached () {
    return this.scrollEl.scrollTop + this.scrollEl.offsetHeight + 1 >= this.scrollEl.scrollHeight;
  };

  handleTouchStart (event: TouchEvent) {
    this.startY = event.touches[0].clientY;
    this.startX = event.touches[0].clientX;
    this.beforeDiff = this.diff;
    this.startScrollTop = this.scrollEl.scrollTop;
    this.bottomReached = this.checkBottomReached();
  };

  handleTouchMove (event: TouchEvent) {
    this.currentY = event.touches[0].clientY;
    this.currentX = event.touches[0].clientX;
    this.distance = (this.currentY - this.startY) / this.distanceIndex + this.beforeDiff;
    // judge pan gesture direction, if not vertival just return
    // make sure that if some components embeded can handle horizontal pan gesture in here
    if (Math.abs(this.currentY - this.startY) < Math.abs(this.currentX - this.startX)) {
      return;
    }
    this.direction = this.distance > 0 ? 'down' : 'up';

    if (this.startScrollTop === 0 && this.direction === 'down' && this.isTopBounce) {
      event.preventDefault();
      event.stopPropagation();
      this.diff = this.distance;
      this.isThrottleTopPull ? this.throttleEmitTopPull(this.diff) : this.$emit('top-pull', this.diff);

      if (typeof this.topLoadMethod !== 'function') {
        return;
      }

      if (this.distance < this._topConfig.triggerDistance &&
              this.state !== 'pull' && this.state !== 'loading') {
        this.actionPull();
      } else if (this.distance >= this._topConfig.triggerDistance &&
              this.state !== 'trigger' && this.state !== 'loading') {
        this.actionTrigger();
      }
    } else if (this.bottomReached && this.direction === 'up' && this.isBottomBounce) {
      event.preventDefault();
      event.stopPropagation();
      this.diff = this.distance;
      this.isThrottleBottomPull ? this.throttleEmitBottomPull(this.diff) : this.$emit('bottom-pull', this.diff);

      if (typeof this.bottomLoadMethod !== 'function') {
        return;
      }

      if (Math.abs(this.distance) < this._bottomConfig.triggerDistance &&
              this.state !== 'pull' && this.state !== 'loading') {
        this.actionPull();
      } else if (Math.abs(this.distance) >= this._bottomConfig.triggerDistance &&
              this.state !== 'trigger' && this.state !== 'loading') {
        this.actionTrigger();
      }
    }
  };

  handleTouchEnd () {
    if (this.diff === 0) {
      return;
    }
    if (this.state === 'trigger') {
      this.actionLoading();
      return;
    }
    // pull cancel
    this.scrollTo(0);
  };

  handleScroll (event: Event) {
    this.isThrottleScroll ? this.throttleEmitScroll(event) : this.$emit('scroll', event);
    this.throttleOnInfiniteScroll();
  };

  onInfiniteScroll () {
    if (this.checkBottomReached()) {
      this.$emit('infinite-scroll');
    }
  };

  throttleEmit (delay: number, mustRunDelay = 0, eventName: string) {
    const throttleMethod = () => {
      const args = [...arguments];
      args.unshift(eventName);
      // @ts-ignore
      this.$emit.apply(this, args);
    };

    return throttle(throttleMethod, delay, mustRunDelay);
  };

  bindEvents () {
    this.scrollEl.addEventListener('touchstart', this.handleTouchStart);
    this.scrollEl.addEventListener('touchmove', this.handleTouchMove);
    this.scrollEl.addEventListener('touchend', this.handleTouchEnd);
    this.scrollEl.addEventListener('scroll', this.handleScroll);
  };

  createThrottleMethods () {
    this.throttleEmitTopPull = this.throttleEmit(200, 300, 'top-pull');
    this.throttleEmitBottomPull = this.throttleEmit(200, 300, 'bottom-pull');
    this.throttleEmitScroll = this.throttleEmit(100, 150, 'scroll');
    this.throttleOnInfiniteScroll = throttle(this.onInfiniteScroll, 400);
  };
  mounted () {
    this.createThrottleMethods();
    this.scrollEl = (this.$refs.scrollContainer as HTMLElement);
    if (this.scrollEl) {
      this.bindEvents();
    }
  }
}
</script>

<style scoped>
  .vpr-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .vpr-scroll-container {
    flex: 1;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .vpr-wrapper .vpr-action-block {
    position: relative;
    width: 100%;
  }

  .vpr-default-text {
    height: 100%;
    line-height: 50px;
    text-align: center;
  }
</style>
