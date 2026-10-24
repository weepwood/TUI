import { useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react'

export type UploadRejection = 'limit' | 'duplicate' | 'type'
export interface UploadDropzoneProps {
  label: string
  value?: readonly File[]
  defaultValue?: readonly File[]
  onFilesChange?: (files: File[]) => void
  onReject?: (reason: UploadRejection, file: File) => void
  accept?: string
  multiple?: boolean
  maxFiles?: number
  disabled?: boolean
  className?: string
}

const fileKey = (file: File) => file.name + '/' + file.size + '/' + file.lastModified
/** MIME and extension checks also apply to drag and drop (native input accept does not). */
export function acceptsFile(file: Pick<File, 'name' | 'type'>, accept?: string) {
  if (!accept?.trim()) return true
  const mime = file.type.toLowerCase()
  const name = file.name.toLowerCase()
  return accept.toLowerCase().split(',').map(x => x.trim()).filter(Boolean).some(rule =>
    rule.startsWith('.') ? name.endsWith(rule) :
    rule.endsWith('/*') ? mime.startsWith(rule.slice(0, -1)) : mime === rule
  )
}
export function pickFiles(
  previous: readonly File[], incoming: readonly File[], maxFiles: number, accept?: string, multiple = true,
) {
  const result = [...previous]
  const rejected: { reason: UploadRejection, file: File }[] = []
  for (const file of (multiple ? incoming : incoming.slice(0, 1))) {
    if (!acceptsFile(file, accept)) rejected.push({ reason: 'type', file })
    else if (result.some(item => fileKey(item) === fileKey(file))) rejected.push({ reason: 'duplicate', file })
    else if (result.length >= maxFiles) rejected.push({ reason: 'limit', file })
    else result.push(file)
  }
  return { files: result, rejected }
}
function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

export function UploadDropzone({
  label, value, defaultValue = [], onFilesChange, onReject, accept, multiple = true,
  maxFiles = 5, disabled = false, className = '',
}: UploadDropzoneProps) {
  const [localFiles, setLocalFiles] = useState<File[]>(() => [...defaultValue])
  const [over, setOver] = useState(false)
  const files = value === undefined ? localFiles : value
  const limit = Number.isFinite(maxFiles) ? Math.max(1, Math.floor(maxFiles)) : 5
  const inputRef = useRef<HTMLInputElement>(null)
  const id = useId()
  const publish = (next: File[]) => {
    if (value === undefined) setLocalFiles(next)
    onFilesChange?.(next)
  }
  const add = (incoming: File[]) => {
    if (disabled || !incoming.length) return
    const next = pickFiles(files, incoming, limit, accept, multiple)
    next.rejected.forEach(item => onReject?.(item.reason, item.file))
    if (next.files.length !== files.length) publish(next.files)
  }
  const onInput = (event: ChangeEvent<HTMLInputElement>) => {
    add(Array.from(event.currentTarget.files ?? []))
    event.currentTarget.value = ''
  }
  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setOver(false)
    add(Array.from(event.dataTransfer.files))
  }
  return (
    <div className={['tui-upload', className].filter(Boolean).join(' ')}>
      <div
        className={['tui-upload__zone', over && 'is-over', disabled && 'is-disabled'].filter(Boolean).join(' ')}
        onDragOver={event => { event.preventDefault(); if (!disabled) setOver(true) }}
        onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOver(false) }}
        onDrop={onDrop}
      >
        <strong>{label}</strong>
        <span>拖入文件，或选择本地文件；不会自动上传</span>
        <button type="button" disabled={disabled || files.length >= limit} onClick={() => inputRef.current?.click()}>选择文件</button>
        <input
          ref={inputRef}
          id={id}
          type="file"
          aria-label={label}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          tabIndex={-1}
          className="tui-upload__native"
          onChange={onInput}
        />
      </div>
      {files.length > 0 && (
        <ul className="tui-upload__files" aria-label={label + '的文件'}>
          {files.map(file => (
            <li key={fileKey(file)}>
              <span title={file.name}>{file.name}</span>
              <small>{formatSize(file.size)}</small>
              <button
                type="button"
                disabled={disabled}
                aria-label={'移除 ' + file.name}
                onClick={() => publish(files.filter(item => fileKey(item) !== fileKey(file)))}
              >×</button>
            </li>
          ))}
        </ul>
      )}
      <small className="tui-upload__hint">{files.length}/{limit} 个文件</small>
    </div>
  )
}
