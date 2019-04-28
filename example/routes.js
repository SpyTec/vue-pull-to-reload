import InfiniteScroll from './pages/InfiniteScroll';
import BounceScroll from './pages/BounceScroll';
import SimplePullToLoadMore from './pages/SimplePullToLoadMore';
import SimplePullToRefresh from './pages/SimplePullToRefresh';
import Home from './pages/Home';

export default [
  {
    path: '/',
    component: Home
  },
  {
    path: '/bounce-scroll',
    component: BounceScroll
  },
  {
    path: '/simple-pullto-loadmore',
    component: SimplePullToLoadMore
  },
  {
    path: '/simple-pullto-refresh',
    component: SimplePullToRefresh
  },
  {
    path: '/infinite-scroll',
    component: InfiniteScroll
  }
];
