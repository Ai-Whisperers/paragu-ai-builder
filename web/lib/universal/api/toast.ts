import { toast } from 'sonner'

type ToastType = 'success' | 'error' | 'info' | 'warning'

const spanishDefaults: Record<ToastType, string> = {
  success: '¡Listo!',
  error: 'Algo salió mal',
  info: 'Información',
  warning: 'Atención',
}

function mapTypeToSonner(type?: ToastType): 'success' | 'error' | 'info' | 'warning' {
  return type || 'info'
}

export function showToast(message: string, type: ToastType = 'info') {
  const fn = toast[mapTypeToSonner(type)]
  fn(message)
}

showToast.success = (message?: string) => {
  toast.success(message || spanishDefaults.success)
}

showToast.error = (message?: string) => {
  toast.error(message || spanishDefaults.error)
}

showToast.info = (message?: string) => {
  toast.info(message || spanishDefaults.info)
}

showToast.warning = (message?: string) => {
  toast.warning(message || spanishDefaults.warning)
}

export { toast }
export default showToast