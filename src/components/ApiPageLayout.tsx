import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink, Copy, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { baseUrl } from '@/lib/config'

interface ApiPageLayoutProps {
  title: string
  description: string
  endpoint: string
  children: ReactNode
  examples?: Array<{
    title: string
    description: string
    url: string
    response?: string
  }>
  parameters?: Array<{
    name: string
    type: string
    required: boolean
    description: string
    example?: string
  }>
}

export const ApiPageLayout = ({ 
  title, 
  description, 
  endpoint, 
  children, 
  examples = [],
  parameters = []
}: ApiPageLayoutProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const openInNewTab = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首页
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">{description}</p>
            </div>
          </div>
          
          {/* Endpoint Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                接口信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    接口地址
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 font-mono text-sm bg-gray-100 px-3 py-2 rounded border break-all">
                      {baseUrl}{endpoint}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(`${baseUrl}${endpoint}`)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openInNewTab(`${baseUrl}${endpoint}`)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Parameters */}
          {parameters.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">请求参数</CardTitle>
                <CardDescription>
                  接口支持的参数列表
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parameters.map((param) => (
                    <div key={param.name} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-sm font-medium text-blue-600">
                          {param.name}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {param.type}
                        </span>
                        {param.required ? (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            必需
                          </span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            可选
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{param.description}</p>
                      {param.example && (
                        <div className="text-xs">
                          <span className="text-gray-500">示例：</span>
                          <code className="ml-1 bg-gray-100 px-1 py-0.5 rounded">{param.example}</code>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Examples */}
          {examples.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">使用示例</CardTitle>
                <CardDescription>
                  常见的使用场景和示例
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {examples.map((example, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-2">{example.title}</h4>
                      <p className="text-xs text-gray-600 mb-3">{example.description}</p>
                      
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">请求URL</label>
                          <div className="flex gap-2">
                            <div className="flex-1 font-mono text-xs bg-gray-100 px-2 py-1 rounded break-all">
                              {example.url}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(example.url)}
                              className="h-7 w-7 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openInNewTab(example.url)}
                              className="h-7 w-7 p-0"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {example.response && (
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">响应示例</label>
                            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                              {example.response}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Interactive Section */}
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  )
}
