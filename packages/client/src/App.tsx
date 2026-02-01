import { useState } from 'react'
import PasteView from './components/PasteView'
import FetchView from './components/FetchView'

type Tab = 'paste' | 'fetch'

export default function App() {
  const [tab, setTab] = useState<Tab>(() => {
    const params = new URLSearchParams(window.location.search)
    return params.has('code') ? 'fetch' : 'paste'
  })

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-1 tracking-wide">
        Cross<span className="text-accent">Clip</span>
      </h1>
      <p className="text-gray-500 text-sm mb-8">跨端剪贴板</p>

      <div className="w-full max-w-2xl flex flex-col flex-1">
        {/* Tab 切换 */}
        <div className="flex gap-1 mb-6 bg-bg-secondary p-1 rounded-xl self-start">
          <button
            onClick={() => setTab('paste')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              tab === 'paste'
                ? 'bg-accent text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            粘贴内容
          </button>
          <button
            onClick={() => setTab('fetch')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              tab === 'fetch'
                ? 'bg-accent text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            获取内容
          </button>
        </div>

        {/* 内容区 */}
        {tab === 'paste' ? <PasteView /> : <FetchView />}
      </div>

      <footer className="mt-10 text-gray-600 text-xs">
        CrossClip &mdash; 简洁跨端剪贴
      </footer>
    </div>
  )
}
