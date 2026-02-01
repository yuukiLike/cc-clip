import { useState, useEffect } from 'react'
import { useClip } from '../hooks/useClip'

export default function FetchView() {
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [needPassword, setNeedPassword] = useState(false)
  const [content, setContent] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const { fetchClip, loading, error, setError } = useClip()

  // 从 URL 参数读取短码
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const codeParam = params.get('code')
    if (codeParam) {
      setCode(codeParam)
      handleFetch(codeParam)
    }
  }, [])

  async function handleFetch(codeOverride?: string) {
    const targetCode = codeOverride || code
    if (!targetCode.trim()) return

    const result = await fetchClip(targetCode, needPassword ? password : undefined)
    if (result) {
      setContent(result.content)
      setNeedPassword(false)
    } else if (error === '需要密码') {
      setNeedPassword(true)
    }
  }

  async function handlePasswordSubmit() {
    if (!password.trim()) return
    const result = await fetchClip(code, password)
    if (result) {
      setContent(result.content)
      setNeedPassword(false)
    }
  }

  function copyContent() {
    if (!content) return
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function reset() {
    setCode('')
    setPassword('')
    setContent(null)
    setNeedPassword(false)
    setError(null)
  }

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex gap-3">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
          placeholder="输入短码..."
          className="flex-1 px-4 py-3 bg-bg-card text-white font-mono text-lg tracking-wider rounded-xl border border-gray-700 focus:border-accent focus:outline-none transition-colors placeholder-gray-600"
        />
        <button
          onClick={() => handleFetch()}
          disabled={loading || !code.trim()}
          className="px-6 py-3 bg-accent hover:bg-accent/80 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium rounded-xl transition-colors"
        >
          {loading ? '获取中...' : '获取'}
        </button>
      </div>

      {needPassword && (
        <div className="flex gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            placeholder="此内容需要密码..."
            className="flex-1 px-4 py-3 bg-bg-card text-white rounded-xl border border-yellow-600/50 focus:border-yellow-500 focus:outline-none transition-colors placeholder-gray-500"
          />
          <button
            onClick={handlePasswordSubmit}
            disabled={loading || !password.trim()}
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            验证
          </button>
        </div>
      )}

      {error && error !== '需要密码' && (
        <div className="text-red-400 text-sm">{error}</div>
      )}

      {content !== null && (
        <>
          <textarea
            readOnly
            value={content}
            className="flex-1 min-h-[300px] bg-bg-card text-gray-100 font-mono text-sm p-4 rounded-xl border border-gray-700"
          />
          <div className="flex gap-3">
            <button
              onClick={copyContent}
              className="px-5 py-2 bg-accent hover:bg-accent/80 text-white text-sm font-medium rounded-xl transition-colors"
            >
              {copied ? '已复制' : '复制内容'}
            </button>
            <button
              onClick={reset}
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-xl transition-colors"
            >
              新查询
            </button>
          </div>
        </>
      )}
    </div>
  )
}
