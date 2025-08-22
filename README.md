# 🤖 Chatbot Flow Builder

A **visual chatbot flow builder** built with modern frontend technologies:  
⚛️ React • 🟦 TypeScript • ⚡ Vite • 🎨 Tailwind CSS • 🔗 React Flow

This project was built as a frontend assignment to demonstrate skills in **React, TypeScript, state management, custom components, validation logic, and visual graph building**.

---

## ✨ Features

### 🎨 Modern UI
- Clean **Tailwind CSS** styling with **dark mode** toggle 🌙  
- Smooth shadows, rounded corners, badges, and polished panels  
- Responsive layout with collapsible panels

### 🧱 Node System
- **Text Node**: current supported block to send a chatbot message  
- Each node displays its content with a clear label  
- Entry nodes (no incoming connections) are highlighted as **Start**

### 🔗 Flow Connections
- Drag handles to connect nodes  
- **Rules enforced**:
  - Each node’s **source** → only **one outgoing edge** allowed  
  - Each node’s **target** → can accept **multiple incoming edges**

### ⚙️ Settings Panel
- Click a node to open its **settings editor**  
- Update the text content of the message  
- Auto-focus when switching between nodes  
- Replace the Nodes Panel with Settings Panel when editing

### 💾 Save & Validation
- **Flow validation before saving**:
  - ❌ Cannot save an **empty flow**  
  - ❌ Cannot save if **multiple entry nodes** exist (multiple nodes with no incoming edges)  
- ✅ On success → downloads a timestamped JSON file

### getting started
     -git clone https://github.com/rahul-6472/bitespeed-flow-builder-plus.git
     -cd chatbot-flow-builder-plus
### Deployed Link
     -https://bitespeedflowbuilder.netlify.app/

