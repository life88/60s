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
        </Routes>
      </div>
    </Router>
  )
}

export default App
