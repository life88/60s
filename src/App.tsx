import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EndpointPage from './pages/EndpointPage'
import SixtySecondsPage from './pages/api/SixtySecondsPage'
import TranslatePage from './pages/api/TranslatePage'
import HitokotoPage from './pages/api/HitokotoPage'
import IpQueryPage from './pages/api/IpQueryPage'
import ExchangeRatePage from './pages/api/ExchangeRatePage'
import WallpaperPage from './pages/api/WallpaperPage'
import WeiboPage from './pages/api/WeiboPage'
import ZhihuPage from './pages/api/ZhihuPage'
import HistoryPage from './pages/api/HistoryPage'
import ToutiaoPage from './pages/api/ToutiaoPage'
import BingWallpaperPage from './pages/api/BingWallpaperPage'
import DogPage from './pages/api/DogPage'
import BaikePage from './pages/api/BaikePage'
import BiliPage from './pages/api/BiliPage'
import DouyinPage from './pages/api/DouyinPage'
import EpicPage from './pages/api/EpicPage'
import DuanziPage from './pages/api/DuanziPage'
import FabingPage from './pages/api/FabingPage'
import LuckPage from './pages/api/LuckPage'
import AnswerPage from './pages/api/AnswerPage'
import ChemicalPage from './pages/api/ChemicalPage'
import HashPage from './pages/api/HashPage'
import MaoyanPage from './pages/api/MaoyanPage'
import OgPage from './pages/api/OgPage'
import LunarPage from './pages/api/LunarPage'
import WeatherPage from './pages/api/WeatherPage'
import KfcPage from './pages/api/KfcPage'
import FanyiLangsPage from './pages/api/FanyiLangsPage'
import ChangyaPage from './pages/api/ChangyaPage'
import Weather7dPage from './pages/api/Weather7dPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/endpoint/:name" element={<EndpointPage />} />
          {/* 专门的接口页面 */}
          <Route path="/api/60s" element={<SixtySecondsPage />} />
          <Route path="/api/fanyi" element={<TranslatePage />} />
          <Route path="/api/hitokoto" element={<HitokotoPage />} />
          <Route path="/api/ip" element={<IpQueryPage />} />
          <Route path="/api/exchange_rate" element={<ExchangeRatePage />} />
          <Route path="/api/bizhi" element={<WallpaperPage />} />
          <Route path="/api/weibo" element={<WeiboPage />} />
          <Route path="/api/zhihu" element={<ZhihuPage />} />
          <Route path="/api/today_in_history" element={<HistoryPage />} />
          <Route path="/api/toutiao" element={<ToutiaoPage />} />
          <Route path="/api/bing" element={<BingWallpaperPage />} />
          <Route path="/api/dog" element={<DogPage />} />
          <Route path="/api/baike" element={<BaikePage />} />
          <Route path="/api/bili" element={<BiliPage />} />
          <Route path="/api/douyin" element={<DouyinPage />} />
          <Route path="/api/epic" element={<EpicPage />} />
          <Route path="/api/duanzi" element={<DuanziPage />} />
          <Route path="/api/fabing" element={<FabingPage />} />
          <Route path="/api/luck" element={<LuckPage />} />
          <Route path="/api/answer" element={<AnswerPage />} />
          <Route path="/api/chemical" element={<ChemicalPage />} />
          <Route path="/api/hash" element={<HashPage />} />
          <Route path="/api/maoyan" element={<MaoyanPage />} />
          <Route path="/api/og" element={<OgPage />} />
          <Route path="/api/lunar" element={<LunarPage />} />
          <Route path="/api/weather" element={<WeatherPage />} />
          <Route path="/api/kfc" element={<KfcPage />} />
          <Route path="/api/fanyi/langs" element={<FanyiLangsPage />} />
          <Route path="/api/changya" element={<ChangyaPage />} />
          <Route path="/api/weather/7d" element={<Weather7dPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
