import { useState } from 'react'
import { useClip } from '../hooks/useClip'
import JsonTools from './JsonTools'

export default function PasteView() {
  const [content, setContent] = useState('')
  const [usePassword, setUsePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [resultCode, setResultCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const { createClip, loading, error } = useClip()

  async function handleSubmit() {
    if (!content.trim()) return
    const code = await createClip(content, usePassword ? password : undefined)
    if (code) {
      setResultCode(code)
    }
  }

  function copyCode() {
    if (!resultCode) return
    navigator.clipboard.writeText(resultCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function copyLink() {
    if (!resultCode) return
    navigator.clipboard.writeText(`${window.location.origin}?code=${resultCode}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function reset() {
    setContent('')
    setPassword('')
    setResultCode(null)
    setUsePassword(false)
  }

  return (
    <div className="flex flex-col gap-4 flex-1">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="粘贴内容到这里..."
        className="flex-1 min-h-[300px] bg-bg-card text-gray-100 font-mono text-sm p-4 rounded-xl border border-gray-700 focus:border-accent transition-colors placeholder-gray-600"
      />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <JsonTools content={content} onChange={setContent} />

          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={usePassword}
              onChange={(e) => setUsePassword(e.target.checked)}
              className="accent-accent"
            />
            密码保护
          </label>

          {usePassword && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="设置密码"
              className="px-3 py-1.5 text-sm bg-bg-card text-white rounded-lg border border-gray-700 focus:border-accent focus:outline-none transition-colors w-32"
            />
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          className="px-5 py-2 bg-accent hover:bg-accent/80 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium rounded-xl transition-colors"
        >
          {loading ? '生成中...' : '生成短码'}
        </button>
      </div>

      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}

      {resultCode && (
        <div className="flex items-center gap-3 p-4 bg-bg-card rounded-xl border border-accent/30">
          <span className="text-gray-400 text-sm">短码：</span>
          <span className="text-accent font-bold text-lg tracking-wider">{resultCode}</span>
          <button
            onClick={copyCode}
            className="px-3 py-1.5 text-xs bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors"
          >
            {copied ? '已复制' : '复制短码'}
          </button>
          <button
            onClick={copyLink}
            className="px-3 py-1.5 text-xs bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors"
          >
            复制链接
          </button>
          <button
            onClick={reset}
            className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors ml-auto"
          >
            新建
          </button>
        </div>
      )}
    </div>
  )
}
