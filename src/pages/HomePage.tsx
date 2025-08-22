import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Search, ExternalLink, Github, Globe } from 'lucide-react'
import { baseUrl } from '@/lib/config'

interface ApiInfo {
  api_name: string
  api_version: string
  api_docs: string
  author: string
  user_group: string
  github_repo: string
  updated: string
  updated_at: number
  endpoints: string[]
}

const HomePage = () => {
  const [apiInfo, setApiInfo] = useState<ApiInfo | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApiInfo = async () => {
      try {
        const response = await fetch(`${baseUrl}/`)
        const data = await response.json()
        setApiInfo(data)
      } catch (error) {
        console.error('Failed to fetch API info:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchApiInfo()
  }, [])

  const filteredEndpoints = apiInfo?.endpoints.filter(endpoint =>
    endpoint.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const getEndpointName = (endpoint: string) => {
    return endpoint.replace('/v2/', '')
  }

  const getEndpointDescription = (endpoint: string) => {
    const descriptions: { [key: string]: string } = {
      // 日更资讯
      '60s': '每日60秒读懂世界新闻摘要',
      'bing': '必应每日壁纸',
      'exchange_rate': '当日货币汇率',
      'today_in_history': '历史上的今天',
      
      // 热门榜单
      'bili': '哔哩哔哩热搜榜',
      'maoyan': '猫眼票房排行榜',
      'weibo': '微博热搜榜',
      'zhihu': '知乎热门话题',
      'douyin': '抖音热搜榜',
      'toutiao': '头条热搜榜',
      
      // 实用功能
      'epic': 'Epic Games 免费游戏',
      'baike': '百度百科词条',
      'fanyi': '在线翻译（支持109种语言）',
      'fanyi/langs': '翻译支持的语言列表',
      'ip': '公网IP地址查询',
      'og': '链接OG信息获取',
      'hash': '哈希/解压/压缩',
      'weather': '天气查询',
      '7d': '7天天气预报',
      'lunar': '农历信息查询',
      
      // 消遣娱乐
      'changya': '随机唱歌音频',
      'chemical': '随机化合物',
      'hitokoto': '随机一言',
      'luck': '随机运势',
      'duanzi': '随机搞笑段子',
      'fabing': '随机发病文学',
      'answer': '随机答案之书',
      'kfc': 'KFC疯狂星期四文案',
      
      // 其他
      'bizhi': '随机壁纸',
      'dog': '随机狗狗图片'
    }
    
    const name = getEndpointName(endpoint)
    return descriptions[name] || '接口服务'
  }

  // 获取接口分类
  const getEndpointCategory = (endpoint: string): string => {
    const name = getEndpointName(endpoint)
    
    const categories: { [key: string]: string } = {
      // 日更资讯
      '60s': '🗞️ 日更资讯',
      'bing': '🗞️ 日更资讯',
      'exchange_rate': '🗞️ 日更资讯',
      'today_in_history': '🗞️ 日更资讯',
      
      // 热门榜单
      'bili': '🔥 热门榜单',
      'maoyan': '🔥 热门榜单',
      'weibo': '🔥 热门榜单',
      'zhihu': '🔥 热门榜单',
      'douyin': '🔥 热门榜单',
      'toutiao': '🔥 热门榜单',
      
      // 实用功能
      'epic': '🛠️ 实用功能',
      'baike': '🛠️ 实用功能',
      'fanyi': '🛠️ 实用功能',
      'fanyi/langs': '🛠️ 实用功能',
      'ip': '🛠️ 实用功能',
      'og': '🛠️ 实用功能',
      'hash': '🛠️ 实用功能',
      'weather': '🛠️ 实用功能',
      '7d': '🛠️ 实用功能',
      'lunar': '🛠️ 实用功能',
      
      // 消遣娱乐
      'changya': '🎮 消遣娱乐',
      'chemical': '🎮 消遣娱乐',
      'hitokoto': '🎮 消遣娱乐',
      'luck': '🎮 消遣娱乐',
      'duanzi': '🎮 消遣娱乐',
      'fabing': '🎮 消遣娱乐',
      'answer': '🎮 消遣娱乐',
      'kfc': '🎮 消遣娱乐',
      
      // 其他
      'bizhi': '📸 其他',
      'dog': '📸 其他'
    }
    
    return categories[name] || '📸 其他'
  }

  // 获取分类颜色
  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      '🗞️ 日更资讯': 'bg-blue-100 text-blue-800',
      '🔥 热门榜单': 'bg-red-100 text-red-800',
      '🛠️ 实用功能': 'bg-green-100 text-green-800',
      '🎮 消遣娱乐': 'bg-purple-100 text-purple-800',
      '📸 其他': 'bg-gray-100 text-gray-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  // 检查是否有专门页面
  const hasSpecialPage = (endpoint: string): boolean => {
    const name = getEndpointName(endpoint)
    const specialPages = [
      '60s', 'fanyi', 'hitokoto', 'ip', 'exchange_rate', 
      'bizhi', 'weibo', 'zhihu', 'today_in_history', 
      'toutiao', 'bing', 'dog', 'baike', 'bili', 
      'douyin', 'epic', 'duanzi', 'fabing', 'luck', 
      'answer', 'chemical', 'hash', 'maoyan', 'og', 
      'lunar', 'weather', 'kfc', 'fanyi/langs', 'changya', '7d'
    ]
    return specialPages.includes(name)
  }

  // 按分类分组端点
  const groupedEndpoints = filteredEndpoints.reduce((groups: { [key: string]: string[] }, endpoint) => {
    const category = getEndpointCategory(endpoint)
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(endpoint)
    return groups
  }, {})

  // 定义分类显示顺序
  const categoryOrder = [
    '🗞️ 日更资讯',
    '🔥 热门榜单', 
    '🛠️ 实用功能',
    '🎮 消遣娱乐',
    '📸 其他'
  ]

  // 按照预定义顺序获取有序的分类数组
  const orderedCategories = categoryOrder.filter(category => groupedEndpoints[category])
    .map(category => [category, groupedEndpoints[category]] as [string, string[]])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="正在加载API信息..." />
      </div>
    )
  }

  if (!apiInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">无法连接到API服务</p>
          <p className="text-gray-600 mt-2">请确保 {baseUrl} 服务正在运行</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">{apiInfo.api_name}</h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-4 sm:mb-6">版本 {apiInfo.api_version}</p>
          
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 mb-4 sm:mb-8">
            <a
              href={apiInfo.api_docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm sm:text-base">API文档</span>
            </a>
            <a
              href='https://github.com/life88/60s'
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm sm:text-base">GitHub</span>
            </a>
          </div>

          <div className="text-xs sm:text-sm text-gray-600 space-y-1">
            <p>更新时间: {apiInfo.updated}</p>
            <p>共 {apiInfo.endpoints.length} 个接口</p>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-6 sm:mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="搜索接口..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Grouped Endpoints */}
        <div className="space-y-8">
          {orderedCategories.map(([category, endpoints]) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-gray-900">{category}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)}`}>
                  {endpoints.length} 个接口
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {endpoints.map((endpoint) => {
                  const name = getEndpointName(endpoint)
                  const description = getEndpointDescription(endpoint)
                  const category = getEndpointCategory(endpoint)
                  
                  return (
                    <Card key={endpoint} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base sm:text-lg">
                            {hasSpecialPage(endpoint) ? (
                              <Link 
                                to={`/api/${name}`} 
                                className="flex items-center gap-2 hover:text-blue-700 transition-colors group"
                              >
                                <span className="font-mono text-blue-600 break-all">/{name}</span>
                                <ExternalLink className="w-4 h-4 text-blue-500 group-hover:text-blue-700 transition-colors flex-shrink-0" />
                              </Link>
                            ) : (
                              <span className="flex items-center gap-2">
                                <span className="font-mono text-blue-600 break-all">/{name}</span>
                              </span>
                            )}
                          </CardTitle>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(category)} ml-2 flex-shrink-0`}>
                            {category.split(' ')[0]}
                          </span>
                        </div>
                        <CardDescription className="text-sm">{description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-xs sm:text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded break-all">
                            {endpoint}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-2">
                            {hasSpecialPage(endpoint) ? (
                              <Button asChild size="sm" className="text-sm">
                                <Link to={`/api/${name}`}>
                                  打开页面
                                </Link>
                              </Button>
                            ) : (
                              <Button asChild size="sm" className="text-sm">
                                <Link to={`/endpoint/${name}`}>
                                  测试接口
                                </Link>
                              </Button>
                            )}
                            <Button asChild variant="outline" size="sm" className="text-sm">
                              <a href={`${baseUrl}${endpoint}`} target="_blank" rel="noopener noreferrer">
                                直接访问
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm mb-2">
            60s API - 高质量、开源、可靠的开放API集合
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
