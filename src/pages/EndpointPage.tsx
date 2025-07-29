import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Send, Copy, ExternalLink, RefreshCw } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const EndpointPage = () => {
  const { name } = useParams<{ name: string }>()
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: unknown;
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [params, setParams] = useState<{ [key: string]: string }>({})
  
  const endpoint = `/v2/${name}`
  
  // 定义每个接口的参数配置
  const getEndpointConfig = (endpointName: string) => {
    const configs: { [key: string]: { params: string[], description: string, example?: string } } = {
      '60s': { 
        params: [], 
        description: '获取每日60秒读懂世界的新闻摘要' 
      },
      'answer': { 
        params: ['q'], 
        description: '智能问答服务',
        example: 'q=什么是人工智能'
      },
      'baike': { 
        params: ['q'], 
        description: '百科知识查询',
        example: 'q=人工智能'
      },
      'bili': { 
        params: ['id'], 
        description: '获取B站视频信息',
        example: 'id=BV1234567890'
      },
      'bing': { 
        params: ['q'], 
        description: '必应搜索',
        example: 'q=编程学习'
      },
      'chemical': { 
        params: ['name'], 
        description: '化学元素查询',
        example: 'name=氢'
      },
      'douyin': { 
        params: ['url'], 
        description: '抖音视频解析',
        example: 'url=https://v.douyin.com/xxx'
      },
      'duanzi': { 
        params: [], 
        description: '获取随机段子笑话' 
      },
      'epic': { 
        params: [], 
        description: '获取Epic免费游戏信息' 
      },
      'exchange_rate': { 
        params: ['from', 'to'], 
        description: '汇率查询',
        example: 'from=USD&to=CNY'
      },
      'fabing': { 
        params: [], 
        description: '获取随机发病语录' 
      },
      'hitokoto': { 
        params: [], 
        description: '获取随机一言' 
      },
      'ip': { 
        params: ['ip'], 
        description: 'IP地址查询',
        example: 'ip=8.8.8.8'
      },
      'kfc': { 
        params: [], 
        description: '获取KFC疯狂星期四文案' 
      },
      'luck': { 
        params: [], 
        description: '每日运势查询' 
      },
      'maoyan': { 
        params: [], 
        description: '猫眼电影榜单' 
      },
      'today_in_history': { 
        params: [], 
        description: '历史上的今天' 
      },
      'toutiao': { 
        params: [], 
        description: '今日头条热榜' 
      },
      'weibo': { 
        params: [], 
        description: '微博热搜榜' 
      },
      'zhihu': { 
        params: [], 
        description: '知乎热榜' 
      },
      'og': { 
        params: ['url'], 
        description: '获取网页OG信息',
        example: 'url=https://example.com'
      },
      'hash': { 
        params: ['text', 'type'], 
        description: '文本哈希计算',
        example: 'text=hello&type=md5'
      },
      'fanyi': { 
        params: ['text', 'from', 'to'], 
        description: '文本翻译',
        example: 'text=hello&from=en&to=zh'
      },
      'fanyi/langs': { 
        params: [], 
        description: '获取支持的翻译语言列表' 
      }
    }
    
    return configs[endpointName] || { params: [], description: '接口服务' }
  }

  const config = getEndpointConfig(name || '')

  const handleParamChange = (paramName: string, value: string) => {
    setParams(prev => ({
      ...prev,
      [paramName]: value
    }))
  }

  const buildUrl = () => {
    const apiUrl = `${baseUrl}${endpoint}`
    const queryParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value.trim()) {
        queryParams.append(key, value.trim())
      }
    })
    
    const queryString = queryParams.toString()
    return queryString ? `${apiUrl}?${queryString}` : apiUrl
  }

  const handleRequest = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const url = buildUrl()
      const res = await fetch(url)
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }
      
      const contentType = res.headers.get('content-type')
      let data
      
      if (contentType?.includes('application/json')) {
        data = await res.json()
      } else {
        data = await res.text()
      }
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求失败')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const fillExample = () => {
    if (config.example) {
      const exampleParams = new URLSearchParams(config.example)
      const newParams: { [key: string]: string } = {}
      
      exampleParams.forEach((value, key) => {
        newParams[key] = value
      })
      
      setParams(newParams)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Link>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              <span className="font-mono text-blue-600 break-all">/{name}</span>
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">{config.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">{/* Request Panel */}
          {/* Request Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Send className="w-5 h-5" />
                请求测试
              </CardTitle>
              <CardDescription className="text-sm">
                配置参数并发送请求
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* URL Display */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  请求URL
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 font-mono text-xs sm:text-sm bg-gray-100 px-3 py-2 rounded border break-all overflow-x-auto">
                    {buildUrl()}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(buildUrl())}
                    className="self-start sm:self-center"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Parameters */}
              {config.params.length > 0 && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      请求参数
                    </label>
                    {config.example && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fillExample}
                        className="text-xs sm:text-sm"
                      >
                        使用示例
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {config.params.map((param) => (
                      <div key={param}>
                        <label className="text-sm text-gray-600 mb-1 block">
                          {param}
                        </label>
                        <Input
                          value={params[param] || ''}
                          onChange={(e) => handleParamChange(param, e.target.value)}
                          placeholder={`输入 ${param} 参数`}
                          className="h-10 sm:h-10"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button 
                  onClick={handleRequest} 
                  disabled={loading}
                  className="flex-1 h-12 sm:h-10"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      请求中...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      发送请求
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(buildUrl(), '_blank')}
                  className="h-12 sm:h-10 sm:w-auto"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="ml-2 sm:hidden">在新窗口打开</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Response Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">响应结果</CardTitle>
              <CardDescription className="text-sm">
                API响应的数据内容
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-medium text-sm">请求失败</p>
                  <p className="text-red-600 text-xs mt-1 break-words">{error}</p>
                </div>
              )}

              {response && (
                <div className="space-y-4">
                  {/* Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm font-medium">状态:</span>
                    <span className={`px-2 py-1 rounded text-xs font-mono ${
                      response.status === 200 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {response.status} {response.statusText}
                    </span>
                  </div>

                  {/* Headers */}
                  <div>
                    <p className="text-sm font-medium mb-2">响应头:</p>
                    <div className="bg-gray-100 rounded p-3 text-xs font-mono max-h-32 overflow-y-auto">
                      {Object.entries(response.headers).map(([key, value]) => (
                        <div key={key} className="break-all">
                          <span className="text-blue-600">{key}:</span> {value as string}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Response Data */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <p className="text-sm font-medium">响应数据:</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(
                          typeof response.data === 'string' 
                            ? response.data 
                            : JSON.stringify(response.data, null, 2)
                        )}
                        className="text-xs"
                      >
                        <Copy className="w-4 h-4" />
                        <span className="ml-1 sm:hidden">复制</span>
                      </Button>
                    </div>
                    <div className="bg-gray-100 rounded p-3 text-xs font-mono max-h-96 overflow-auto">
                      <pre className="whitespace-pre-wrap break-all">
                        {typeof response.data === 'string' 
                          ? response.data 
                          : JSON.stringify(response.data, null, 2)
                        }
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {!response && !error && !loading && (
                <div className="text-center py-8 sm:py-12 text-gray-500">
                  <Send className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">点击"发送请求"查看响应结果</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EndpointPage
