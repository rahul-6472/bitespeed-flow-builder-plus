import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  SelectionMode,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import NodesPanel from './components/NodesPanel'
import SettingsPanel from './components/SettingsPanel'
import { TextNode, TEXT_NODE_TYPE, type TextNodeData } from './nodes/TextNode'
import Navbar from './components/Navbar'

type RFNode = Node<TextNodeData>

const initialNodes: RFNode[] = []
const initialEdges: Edge[] = []

let nextId = 1

function FlowCanvas() {
  const [nodes, setNodes] = useState<RFNode[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { screenToFlowPosition } = useReactFlow()

  const nodeTypes = useMemo(() => ({ [TEXT_NODE_TYPE]: TextNode }), [])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const type = event.dataTransfer.getData('application/reactflow')
    if (!type) return
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })
    const id = String(nextId++)
    const newNode: RFNode = { id, type, position, data: { text: 'New message' } }
    setNodes((nds) => nds.concat(newNode))
  }, [screenToFlowPosition])

  const onConnect: OnConnect = useCallback((params: Connection) => {
    if (!params.source) return
    const alreadyHasOutgoing = edges.some((e) => e.source === params.source)
    if (alreadyHasOutgoing) {
      window.alert('Only one connection allowed from the source handle of a node.')
      return
    }
    setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds))
  }, [edges])

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds))
  }, [])

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds))
  }, [])

  const onSelectionChange = useCallback(({ nodes }: { nodes: RFNode[] }) => {
    setSelectedId(nodes[0]?.id ?? null)
  }, [])

  const updateSelectedNodeText = useCallback((text: string) => {
    if (!selectedId) return
    setNodes((nds) => nds.map((n) => n.id === selectedId ? { ...n, data: { ...n.data, text } } as RFNode : n))
  }, [selectedId])

  const computeIncomingCounts = useCallback(() => {
    const map = new Map<string, number>()
    nodes.forEach((n) => map.set(n.id, 0))
    edges.forEach((e) => { if (e.target) map.set(e.target, (map.get(e.target) || 0) + 1) })
    return map
  }, [nodes, edges])

  const markRoots = useCallback(() => {
    const incoming = computeIncomingCounts()
    const roots = Array.from(incoming.entries()).filter(([_, c]) => c === 0).map(([id]) => id)
    setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, isRoot: roots.includes(n.id) } }) as RFNode))
  }, [computeIncomingCounts])

  useEffect(() => { markRoots() }, [edges, nodes.length])

  const validateAndSave = useCallback(() => {
    try {
      const incoming = computeIncomingCounts()
      const roots = Array.from(incoming.entries()).filter(([_, c]) => c === 0).map(([id]) => id)
      if (nodes.length > 1 && roots.length > 1) {
        window.alert('Flow invalid: more than one node has an empty target handle (multiple entries).')
        return
      }
      const payload = {
        nodes: nodes.map(({ id, type, position, data }) => ({ id, type, position, data })),
        edges: edges.map(({ id, source, target, sourceHandle, targetHandle }) => ({ id, source, target, sourceHandle, targetHandle })),
        savedAt: new Date().toISOString(),
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const filename = `flow-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 0)
    } catch (err) {
      console.error(err)
      window.alert('Failed to save the flow. Please try again.')
    }
  }, [nodes, edges, computeIncomingCounts])

  const toggleDark = useCallback(() => {
    document.documentElement.classList.toggle('dark')
  }, [])

  return (
    <div className="grid grid-rows-[56px_1fr] h-dvh">
      <Navbar onReset={() => { setNodes([]); setEdges([]); setSelectedId(null) }} onSave={validateAndSave} onToggleDark={toggleDark} />
      <div className="grid grid-cols-[300px_1fr] min-h-0">
        <aside className="sidebar">
          {selectedId
            ? <SettingsPanel key={selectedId} value={nodes.find(n => n.id === selectedId)?.data.text || ''} onChange={updateSelectedNodeText} onClearSelection={() => setSelectedId(null)} />
            : <NodesPanel />
          }
          <div className="mt-4 subtle space-y-1">
            <div>Tips:</div>
            <ul className="list-disc ml-5 space-y-1">
              <li>Double-click an edge to delete it</li>
              <li>Press Delete/Backspace to remove selection</li>
              <li>Drag to draw selection rectangle</li>
            </ul>
          </div>
        </aside>

        <div className="canvas" onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onEdgesChange={onEdgesChange}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            onSelectionChange={onSelectionChange}
            selectionOnDrag
            selectionMode={SelectionMode.Partial}
            fitView
            deleteKeyCode={['Backspace', 'Delete']}
            onEdgeDoubleClick={(_, edge) => setEdges((eds) => eds.filter((e) => e.id !== edge.id))}
          >
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  )
}
