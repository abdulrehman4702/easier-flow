import { AuthFormGenerator } from "@/components/ai-assistant/auth-form-generator"

interface AuthFormModalProps {
  show: boolean
  onClose: () => void
  onComplete: (authConfig: any) => void
  initialAuthType: string
  serviceType?: string
}

export function AuthFormModal({ show, onClose, onComplete, initialAuthType, serviceType }: AuthFormModalProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <AuthFormGenerator
        onComplete={onComplete}
        onCancel={onClose}
        initialAuthType={initialAuthType}
        serviceType={serviceType}
      />
    </div>
  )
}

