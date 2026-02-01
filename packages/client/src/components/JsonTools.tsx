interface JsonToolsProps {
  content: string
  onChange: (content: string) => void
}

export default function JsonTools({ content, onChange }: JsonToolsProps) {
  const isValidJson = (() => {
    try {
      JSON.parse(content)
      return true
    } catch {
      return false
    }
  })()

  function format() {
    try {
      const parsed = JSON.parse(content)
      onChange(JSON.stringify(parsed, null, 2))
    } catch {
      // ignore
    }
  }

  function compress() {
    try {
      const parsed = JSON.parse(content)
      onChange(JSON.stringify(parsed))
    } catch {
      // ignore
    }
  }

  if (!content.trim() || !isValidJson) return null

  return (
    <div className="flex gap-2">
      <button
        onClick={format}
        className="px-3 py-1.5 text-xs bg-bg-card hover:bg-accent/20 text-gray-300 hover:text-white rounded-lg transition-colors border border-gray-700 hover:border-accent"
      >
        格式化 JSON
      </button>
      <button
        onClick={compress}
        className="px-3 py-1.5 text-xs bg-bg-card hover:bg-accent/20 text-gray-300 hover:text-white rounded-lg transition-colors border border-gray-700 hover:border-accent"
      >
        压缩 JSON
      </button>
    </div>
  )
}
