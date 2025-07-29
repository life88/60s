import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, RefreshCw, AlertCircle } from 'lucide-react'
import { baseUrl } from '@/lib/config'
import { ApiPageLayout } from '@/components/ApiPageLayout'

interface ExchangeRateResponse {
  code: number
  data: {
    from: string
    to: string
    fromAmount: string
    toAmount: string
    rate: string
    updateTime: string
  }
}

const ExchangeRatePage = () => {
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('CNY')
  const [amount, setAmount] = useState('1')
  const [result, setResult] = useState<ExchangeRateResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const currencies = [
    { code: 'USD', name: '美元' },
    { code: 'CNY', name: '人民币' },
    { code: 'EUR', name: '欧元' },
    { code: 'JPY', name: '日元' },
    { code: 'GBP', name: '英镑' },
    { code: 'KRW', name: '韩元' },
    { code: 'HKD', name: '港币' },
    { code: 'AUD', name: '澳元' },
    { code: 'CAD', name: '加元' },
    { code: 'SGD', name: '新加坡元' }
  ]

  const handleExchange = async () => {
    if (!amount || isNaN(Number(amount))) {
      alert('请输入有效的金额')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${baseUrl}/v2/exchange_rate?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('查询失败:', error)
      alert('查询失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const parameters = [
    { name: 'from', type: 'string', required: true, description: '源货币代码，如 USD', example: 'USD' },
    { name: 'to', type: 'string', required: true, description: '目标货币代码，如 CNY', example: 'CNY' },
    { name: 'amount', type: 'number', required: true, description: '转换金额', example: '100' }
  ]

  const examples = [
    {
      title: '美元转人民币',
      description: '查询100美元等于多少人民币',
      url: `${baseUrl}/v2/exchange_rate?from=USD&to=CNY&amount=100`
    },
    {
      title: '欧元转日元',
      description: '查询50欧元等于多少日元',
      url: `${baseUrl}/v2/exchange_rate?from=EUR&to=JPY&amount=50`
    }
  ]

  return (
    <ApiPageLayout
      title="汇率查询"
      description="实时汇率查询服务，支持多种货币之间的汇率转换"
      endpoint="/v2/exchange_rate"
      parameters={parameters}
      examples={examples}
    >
      <div className="space-y-6">
        {/* 交互区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              汇率转换器
            </CardTitle>
            <CardDescription>
              输入金额和货币类型，获取实时汇率转换结果
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="amount">转换金额</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="输入金额"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="from">源货币</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="to">目标货币</Label>
                <div className="flex gap-2 mt-1">
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={swapCurrencies}
                    title="交换货币"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleExchange} 
              disabled={loading}
              className="w-full"
            >
              {loading ? '查询中...' : '获取汇率'}
            </Button>
          </CardContent>
        </Card>

        {/* 结果展示 */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                转换结果
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.code === 200 ? (
                <div className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {result.data.toAmount}
                    </div>
                    <div className="text-gray-600">
                      {result.data.fromAmount} {result.data.from} = {result.data.toAmount} {result.data.to}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      汇率: 1 {result.data.from} = {result.data.rate} {result.data.to}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      更新时间: {result.data.updateTime}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span>查询失败，请检查参数或稍后重试</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ApiPageLayout>
  )
}

export default ExchangeRatePage


