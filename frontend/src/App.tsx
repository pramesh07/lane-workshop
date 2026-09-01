import { Board } from "@/components/board"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <div className="flex h-svh flex-col">
      <Board />
      <Toaster />
    </div>
  )
}

export default App
