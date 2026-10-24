import { useRef, useState } from 'react'
import { useToast } from '../state/app'

interface FakeFile {
  name: string
  size: number
}

const MAX_FILES = 4
const fmtSize = (n: number) => (n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`)

/** 上传区（C-24）：拖入高亮 + 文件芯片列表（Magic UI FileUpload 风格，纯前端演示不真正上传） */
export default function UploadDropzone() {
  const [over, setOver] = useState(false)
  const [files, setFiles] = useState<FakeFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const accept = (list: { name: string; size: number }[]) => {
    setFiles(prev => {
      const next = [...prev]
      for (const f of list) {
        if (next.length >= MAX_FILES) {
          toast(`最多携带 ${MAX_FILES} 份文件`)
          break
        }
        if (!next.some(x => x.name === f.name)) next.push({ name: f.name, size: f.size || 2048 + Math.floor(Math.random() * 40000) })
      }
      return next
    })
  }

  return (
    <div className="dz">
      <div
        className={`dz-area${over ? ' over' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="上传登机牌文件"
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={e => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={e => {
          e.preventDefault()
          setOver(false)
          accept([...e.dataTransfer.files].map(f => ({ name: f.name, size: f.size })))
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 16V4m0 0 4 4m-4-4L8 8" />
          <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
        </svg>
        <b>拖入文件，或点击选择</b>
        <span>登机牌 / 护照扫描件 · 演示组件，不会真正上传</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        onChange={e => {
          accept([...(e.target.files ?? [])].map(f => ({ name: f.name, size: f.size })))
          e.target.value = ''
        }}
      />
      {files.length > 0 && (
        <div className="dz-files">
          {files.map(f => (
            <span key={f.name} className="dz-chip mono">
              {f.name}
              <small>{fmtSize(f.size)}</small>
              <button className="ti-x" onClick={() => setFiles(prev => prev.filter(x => x.name !== f.name))} aria-label={`移除 ${f.name}`}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <span className="hint">{files.length}/{MAX_FILES} 份 · DRAG 移入试试</span>
    </div>
  )
}
