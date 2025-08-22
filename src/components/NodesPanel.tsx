import React from 'react'

const NODE_DEFS = [
  { type: 'textNode', title: 'Text Message', description: 'Send a text message to the user' },
]

export default function NodesPanel() {
  const onDragStart = (event: React.DragEvent, type: string) => {
    event.dataTransfer.setData('application/reactflow', type)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="space-y-3">
      <div className="heading">Nodes</div>
      <div className="subtle">Drag a block onto the canvas</div>
      {NODE_DEFS.map((def) => (
        <div
          key={def.type}
          className="card cursor-grab active:cursor-grabbing select-none"
          draggable
          onDragStart={(e) => onDragStart(e, def.type)}
          title={def.description}
        >
          <div className="flex items-center gap-3">
            <div className="badge">Text</div>
            <div>
              <div className="font-semibold">{def.title}</div>
              <div className="subtle">{def.description}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="subtle">Easily extensible — add to NODE_DEFS.</div>
    </div>
  )
}
