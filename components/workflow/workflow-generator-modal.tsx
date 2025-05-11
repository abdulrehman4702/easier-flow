import { WorkflowGenerator } from "@/components/ai-assistant/workflow-generator"

interface WorkflowGeneratorModalProps {
  show: boolean
  onClose: () => void
  onGenerate: (workflow: any) => void
}

export function WorkflowGeneratorModal({ show, onClose, onGenerate }: WorkflowGeneratorModalProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <WorkflowGenerator onGenerate={onGenerate} onCancel={onClose} />
    </div>
  )
}

