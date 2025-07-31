import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, RefreshCw, AlertCircle, Clock, BookOpen } from 'lucide-react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { baseUrl } from '@/lib/config'

interface HistoryItem {
  title: string
  year: string
  description: string
  event_type: string
  link: string
}

interface HistoryResponse {
  code: number
  message: string
  data: {
    date: string
    month: number
    day: number
    items: HistoryItem[]
  }
}

const HistoryPage = () => {
  const [result, setResult] = useState<HistoryResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGetHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${baseUrl}/v2/today_in_history`)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('获取历史事件失败:', error)
      alert('获取历史事件失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 页面加载时自动获取数据
  useEffect(() => {
    handleGetHistory()
  }, [])

  const parameters = [
    { name: 'date', type: 'string', required: false, description: '指定日期，格式 MM-DD', example: '01-01' }
  ]

  const examples = [
    {
      title: '今天的历史',
      description: '获取今天发生的历史事件',
      url: `${baseUrl}/v2/today_in_history`
    },
    {
      title: '指定日期的历史',
      description: '获取1月1日发生的历史事件',
      url: `${baseUrl}/v2/today_in_history?date=01-01`
    }
  ]

  return (
    <ApiPageLayout
      title="历史上的今天"
      description="了解历史上的今天发生了哪些重要事件，回顾历史长河中的精彩瞬间"
      endpoint="/v2/today_in_history"
      parameters={parameters}
      examples={examples}
    >
      <div className="space-y-6">
        {/* 控制区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              历史上的今天
            </CardTitle>
            <CardDescription>
              探索历史上今天发生的重要事件和里程碑
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGetHistory} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  加载中...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  刷新历史事件
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 结果展示 */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                历史事件
                {result.data?.date && (
                  <Badge variant="secondary" className="ml-auto">
                    <Clock className="w-3 h-3 mr-1" />
                    {result.data.date}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.code === 200 ? (
                <div className="space-y-4">
                  {result.data?.items?.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        {/* 年份标签 */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold flex-shrink-0">
                          {item.year}
                        </div>

                        {/* 事件内容 */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-2 leading-relaxed">
                            {item.title}
                          </h3>
                          
                          {/* 事件描述 */}
                          {item.description && (
                            <p className="text-sm text-gray-600 leading-relaxed mb-3">
                              {item.description.length > 200 ? item.description.substring(0, 200) + '...' : item.description}
                            </p>
                          )}

                          {/* 事件类型 */}
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={
                              item.event_type === 'birth' ? 'default' :
                              item.event_type === 'death' ? 'destructive' :
                              'secondary'
                            }>
                              {item.event_type === 'birth' ? '出生' :
                               item.event_type === 'death' ? '逝世' :
                               '事件'}
                            </Badge>
                          </div>

                          {/* 链接 */}
                          {item.link && (
                            <a 
                              href={item.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              查看详情 →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!result.data || !result.data.items || result.data.items.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      暂无历史事件数据
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span>获取历史事件失败，请稍后重试</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ApiPageLayout>
  )
}

export default HistoryPage
