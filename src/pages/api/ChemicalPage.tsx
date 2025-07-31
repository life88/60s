import { useState } from 'react'
import { ApiPageLayout } from '@/components/ApiPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RefreshCw, FlaskConical, Atom, Search } from 'lucide-react'
import { baseUrl } from '@/lib/config'

const ChemicalPage = () => {
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState('')
  const [data, setData] = useState<{
    code: number;
    message: string;
    data?: {
      id: number;
      name: string;
      mass: number;
      formula: string;
      image: string;
      monoisotopicMass: number;
    };
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async (csid?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const url = csid ? `${baseUrl}/v2/chemical?id=${csid}` : `${baseUrl}/v2/chemical`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchById = () => {
    if (id.trim()) {
      fetchData(id.trim())
    }
  }

  const examples = [
    {
      title: "获取化合物",
      description: "获取一个随机的化学化合物信息",
      url: `${baseUrl}/v2/chemical`,
      response: `{
  "code": 200,
  "message": "所有数据均来自官方，确保稳定与实时",
  "data": {
    "id": 30070538,
    "name": "2-[4-Methyl-6-oxo-2-(4-pyridinyl)-1,6-dihydro-5-pyrimidinyl]-N-(2-phenylethyl)acetamide",
    "mass": 348.406,
    "formula": "C20H20N4O2",
    "image": "https://legacy.chemspider.com/ImagesHandler.ashx?id=30070538",
    "monoisotopicMass": 348.159
  }
}`
    },
    {
      title: "按ID查询化合物",
      description: "通过CSID查询指定的化合物",
      url: `${baseUrl}/v2/chemical?id=937`,
      response: `{
  "code": 200,
  "message": "所有数据均来自官方，确保稳定与实时",
  "data": {
    "id": 937,
    "name": "化合物名称",
    "mass": 123.456,
    "formula": "C6H12O6",
    "image": "https://legacy.chemspider.com/ImagesHandler.ashx?id=937",
    "monoisotopicMass": 123.456
  }
}`
    }
  ]

  return (
    <ApiPageLayout
      title="随机化合物"
      description="获取随机的化学化合物信息，探索化学世界的奥秘"
      endpoint="/v2/chemical"
      examples={examples}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5" />
            化学化合物
          </CardTitle>
          <CardDescription>
            点击下方按钮获取一个随机的化学化合物信息
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 按ID搜索 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <Label htmlFor="csid">化合物ID (CSID，可选)</Label>
                <Input
                  id="csid"
                  type="text"
                  placeholder="输入化合物ID，如 937"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchById()}
                />
              </div>
              <div className="flex flex-col justify-end">
                <Button 
                  onClick={handleSearchById}
                  disabled={loading || !id.trim()}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      搜索中...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      搜索
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* 随机获取 */}
            <div className="text-center">
              <span className="text-sm text-gray-500">或者</span>
            </div>

            <Button 
              onClick={() => fetchData()} 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  获取中...
                </>
              ) : (
                <>
                  <Atom className="w-4 h-4 mr-2" />
                  获取随机化合物
                </>
              )}
            </Button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium text-sm">获取失败</p>
                <p className="text-red-600 text-xs mt-1">{error}</p>
              </div>
            )}

            {data && data.data && (
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FlaskConical className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-blue-800 mb-2 break-words">
                        {data.data.name}
                      </h3>
                      <div className="bg-white px-3 py-1 rounded border inline-block font-mono text-lg text-blue-700">
                        {data.data.formula}
                      </div>
                    </div>
                    {data.data.image && (
                      <img 
                        src={data.data.image} 
                        alt="分子结构"
                        className="w-24 h-24 object-contain bg-white rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 基本信息 */}
                    <div className="p-4 bg-white rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-700 mb-3">� 基本信息</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">ID (CSID):</span>
                          <span className="font-medium">{data.data.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">分子量:</span>
                          <span className="font-medium">{data.data.mass}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">单同位素质量:</span>
                          <span className="font-medium">{data.data.monoisotopicMass}</span>
                        </div>
                      </div>
                    </div>

                    {/* 分子式信息 */}
                    <div className="p-4 bg-white rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-700 mb-3">🧪 分子信息</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600 block mb-1">分子式:</span>
                          <div className="font-mono text-lg bg-gray-50 px-2 py-1 rounded">
                            {data.data.formula}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600 block mb-1">化合物名称:</span>
                          <div className="text-xs break-words bg-gray-50 px-2 py-1 rounded">
                            {data.data.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 图片信息 */}
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="text-xs text-blue-600">
                      🔗 结构图链接: 
                      <a 
                        href={data.data.image} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-1 text-blue-800 hover:underline break-all"
                      >
                        {data.data.image}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </ApiPageLayout>
  )
}

export default ChemicalPage
