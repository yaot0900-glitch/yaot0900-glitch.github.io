import { type ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'judge-true' | 'judge-false'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'min-h-[56px] px-12 py-4 bg-[#F06B04] text-white font-bold text-lg rounded-2xl border-2 border-white hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(240,107,4,0.55),0_6px_28px_rgba(240,107,4,0.35)] active:translate-y-0 transition-all',
  secondary:
    'min-h-[52px] px-10 py-3.5 bg-white border-2 border-[#2B4B7C] text-[#2B4B7C] font-medium rounded-2xl hover:bg-[#F5F7FC] hover:border-[#3D5A8E] hover:shadow-[0_0_20px_rgba(43,75,124,0.12)] active:bg-[#EBEFF5] transition-all shadow-sm',
  'judge-true':
    'min-h-[64px] min-w-[140px] px-14 py-4.5 bg-correct/20 text-correct font-bold text-xl rounded-2xl border-2 border-correct/40 hover:bg-correct/30 hover:shadow-[0_0_24px_rgba(74,222,128,0.3)] active:scale-96 transition-all',
  'judge-false':
    'min-h-[64px] min-w-[140px] px-14 py-4.5 bg-[#F06B04] text-white font-bold text-xl rounded-2xl border-2 border-white hover:bg-[#FF7B1A] hover:shadow-[0_0_28px_rgba(240,107,4,0.50)] active:scale-96 transition-all',
}

export default function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center cursor-pointer touch-manipulation ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
