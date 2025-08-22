import React, { useEffect, useRef, useState } from 'react'

type Props = {
  value: string
  onChange: (next: string) => void
  onClearSelection: () => void
}

export default function SettingsPanel({ value, onChange, onClearSelection }: Props) {
  const [text, setText] = useState(value)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    setText(value)
    inputRef.current?.focus()
  }, [value])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="heading">Settings</h3>
        <button className="button secondary" onClick={onClearSelection}>Done</button>
      </div>

      <label className="heading">Text content</label>
      <textarea
        ref={inputRef}
        className="w-full border border-slate-300 rounded-2xl p-3 min-h-[140px] shadow-soft"
        placeholder="Type the message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <button className="button" onClick={() => onChange(text.trim())} disabled={!text.trim()}>Update</button>
        {!text.trim() && <span className="subtle">Enter some text to enable update</span>}
      </div>
    </div>
  )
}
