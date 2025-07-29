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
    return endpoint.replace('/v2/', '').replace('/', '')
  }

  const getEndpointDescription = (endpoint: string) => {
    const descriptions: { [key: string]: string } = {
      '60s': '每日60秒读懂世界',
      'answer': '智能问答',
      'baike': '百科查询',
      'bili': 'B站相关',
      'bing': '必应搜索',
      'changya': '唱鸭',
      'chemical': '化学元素',
      'douyin': '抖音相关',
      'duanzi': '段子笑话',
      'epic': 'Epic游戏',
      'exchange_rate': '汇率查询',
      'fabing': '发病语录',
      'hitokoto': '一言',
      'ip': 'IP查询',
      'kfc': 'KFC疯狂星期四',
      'luck': '运势查询',
      'maoyan': '猫眼电影',
      'today_in_history': '历史上的今天',
      'toutiao': '今日头条',
      'weibo': '微博热搜',
      'zhihu': '知乎热榜',
      'og': 'OG信息',
      'hash': '哈希算法',
      'fanyi': '翻译服务',
      'fanyi/langs': '支持的语言列表'
    }
    
    const name = getEndpointName(endpoint)
    return descriptions[name] || '接口服务'
  }

  // 检查是否有专门页面
  const hasSpecialPage = (endpoint: string): boolean => {
    const name = getEndpointName(endpoint)
    const specialPages = [
      '60s', 'fanyi', 'hitokoto', 'ip', 'exchange_rate', 
      'bizhi', 'weibo', 'zhihu', 'today_in_history', 
      'toutiao', 'bing', 'dog'
    ]
    return specialPages.includes(name)
  }

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
              href={apiInfo.github_repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm sm:text-base">GitHub</span>
            </a>
          </div>

          <div className="text-xs sm:text-sm text-gray-600 space-y-1">
            <p>作者: {apiInfo.author}</p>
            <p>更新时间: {apiInfo.updated}</p>
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

        {/* Endpoints Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredEndpoints.map((endpoint) => {
            const name = getEndpointName(endpoint)
            const description = getEndpointDescription(endpoint)
            
            return (
              <Card key={endpoint} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
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
                  <CardDescription className="text-sm">{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded break-all">
                      {endpoint}
                    </p>
                    
                    {/* 操作按钮放在同一行 */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button asChild size="sm" className="text-sm">
                        <Link to={`/endpoint/${name}`}>
                          测试接口
                        </Link>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`${baseUrl}${endpoint}`, '_blank')}
                        className="text-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        直接访问
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredEndpoints.length === 0 && searchTerm && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-600">没有找到匹配的接口</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 text-center text-xs sm:text-sm text-gray-500">
          <p>共 {apiInfo.endpoints.length} 个可用接口</p>
        </footer>
      </div>
    </div>
  )
}

export default HomePage
