import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'

export const TEXT_NODE_TYPE = 'textNode'

export type TextNodeData = {
  text: string
  isRoot?: boolean
}

export function TextNode({ data }: NodeProps<TextNodeData>) {
  return (
    <div className={['node', data.isRoot ? 'node--root' : ''].join(' ')}>
      <div className="node-header">Text Message{data.isRoot ? ' • Start' : ''}</div>
      <div className="node-content">{data.text || '—'}</div>
      <Handle type="target" position={Position.Left} id="in" />
      <Handle type="source" position={Position.Right} id="out" />
    </div>
  )
}
