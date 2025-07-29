import { useState, useEffect } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RefreshCw, MapPin, Globe2, Wifi, Search } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const IpQueryPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      ip?: string;
      country?: string;
      province?: string;
      city?: string;
      isp?: string;
      location?: string;
      timezone?: string;
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [ipAddress, setIpAddress] = useState('')
  const [currentIp, setCurrentIp] = useState<string>('')

  // 获取当前IP
  useEffect(() => {
    const getCurrentIp = async () => {
      try {
        const response = await fetch(`${baseUrl}/v2/ip`)
        if (response.ok) {
          const result = await response.json()
          if (result.data?.ip) {
            setCurrentIp(result.data.ip)
          }
        }
      } catch (err) {
        console.log('Failed to get current IP:', err)
      }
    }
    getCurrentIp()
  }, [])

  const queryIp = async (ip?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      let url = `${baseUrl}/v2/ip`
      if (ip && ip.trim()) {
        url += `?ip=${encodeURIComponent(ip.trim())}`
      }
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '查询失败')
    } finally {
      setLoading(false)
    }
  }

  const parameters = [
    {
      name: 'ip',
      type: 'string',
      required: false,
      description: 'IP地址，不传则查询当前访问者IP',
      example: '8.8.8.8'
    }
  ]

  const examples = [
    {
      title: "查询当前IP",
      description: "不传IP参数，查询当前访问者的IP信息",
      url: `${baseUrl}/v2/ip`,
      response: `{
  "code": 200,
  "message": "ok",
  "data": {
    "ip": "192.168.1.1",
    "country": "中国",
    "province": "北京",
    "city": "北京",
    "isp": "电信",
    "location": "北京市海淀区",
    "timezone": "Asia/Shanghai"
  }
}`
    },
    {
      title: "查询指定IP",
      description: "查询Google DNS的IP地址信息",
      url: `${baseUrl}/v2/ip?ip=8.8.8.8`,
      response: `{
  "code": 200,
  "message": "ok",
  "data": {
    "ip": "8.8.8.8",
    "country": "美国",
    "province": "加利福尼亚州",
    "city": "山景城",
    "isp": "Google LLC",
    "location": "美国加利福尼亚州山景城",
    "timezone": "America/Los_Angeles"
  }
}`
    }
  ]

  const commonIps = [
    { name: 'Google DNS', ip: '8.8.8.8' },
    { name: 'Cloudflare DNS', ip: '1.1.1.1' },
    { name: '阿里云DNS', ip: '223.5.5.5' },
    { name: '腾讯DNS', ip: '119.29.29.29' },
    { name: '百度DNS', ip: '180.76.76.76' }
  ]

  return (
    <ApiPageLayout
      title="IP地址查询"
      description="查询IP地址的地理位置、运营商等详细信息"
      endpoint="/v2/ip"
      parameters={parameters}
      examples={examples}
    >
      <div className="space-y-6">
        {/* 查询功能 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              IP查询工具
            </CardTitle>
            <CardDescription>
              输入IP地址进行查询，留空则查询当前IP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 当前IP显示 */}
              {currentIp && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Wifi className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700">当前IP地址: </span>
                    <code className="bg-white px-2 py-1 rounded text-blue-800">{currentIp}</code>
                  </div>
                </div>
              )}

              {/* 查询表单 */}
              <div className="flex gap-2">
                <Input
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="输入IP地址 (如: 8.8.8.8)"
                  className="flex-1"
                />
                <Button 
                  onClick={() => queryIp(ipAddress)} 
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* 常用IP快捷查询 */}
              <div>
                <label className="text-sm font-medium block mb-2">常用IP地址</label>
                <div className="flex flex-wrap gap-2">
                  {commonIps.map((item) => (
                    <Button
                      key={item.ip}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIpAddress(item.ip)
                        queryIp(item.ip)
                      }}
                      disabled={loading}
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 当前IP查询按钮 */}
              <Button 
                onClick={() => queryIp()} 
                disabled={loading}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    查询中...
                  </>
                ) : (
                  <>
                    <Globe2 className="w-4 h-4 mr-2" />
                    查询当前IP
                  </>
                )}
              </Button>

              {/* 错误信息 */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-medium text-sm">查询失败</p>
                  <p className="text-red-600 text-xs mt-1">{error}</p>
                </div>
              )}

              {/* 查询结果 */}
              {data && data.data && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    IP信息详情
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* IP地址 */}
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500">IP地址</label>
                      <p className="font-mono text-sm bg-white p-2 rounded border">
                        {data.data.ip}
                      </p>
                    </div>

                    {/* 地理位置 */}
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500">地理位置</label>
                      <p className="text-sm bg-white p-2 rounded border">
                        {[data.data.country, data.data.province, data.data.city]
                          .filter(Boolean)
                          .join(' ')
                        }
                      </p>
                    </div>

                    {/* 运营商 */}
                    {data.data.isp && (
                      <div className="space-y-2">
                        <label className="text-xs text-gray-500">网络运营商</label>
                        <p className="text-sm bg-white p-2 rounded border">
                          {data.data.isp}
                        </p>
                      </div>
                    )}

                    {/* 时区 */}
                    {data.data.timezone && (
                      <div className="space-y-2">
                        <label className="text-xs text-gray-500">时区</label>
                        <p className="text-sm bg-white p-2 rounded border">
                          {data.data.timezone}
                        </p>
                      </div>
                    )}

                    {/* 详细位置 */}
                    {data.data.location && (
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs text-gray-500">详细位置</label>
                        <p className="text-sm bg-white p-2 rounded border">
                          {data.data.location}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ApiPageLayout>
  )
}

export default IpQueryPage


