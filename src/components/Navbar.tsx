type Props = {
  onReset: () => void
  onSave: () => void
  onToggleDark: () => void
}

export default function Navbar({ onReset, onSave, onToggleDark }: Props) {
  return (
    <div className="navbar">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-brand-500 text-white grid place-items-center font-black">B</div>
        <div className="font-semibold">BiteSpeed • Flow Builder</div>
        <span className="badge">React Flow</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="icon-btn" title="Toggle theme" onClick={onToggleDark}>🌓</button>
        <button className="button secondary" onClick={onReset}>Reset</button>
        <button className="button" onClick={onSave}>Save</button>
      </div>
    </div>
  )
}
