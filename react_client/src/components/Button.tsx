import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export default function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-black text-white border-2 border-white hover:bg-white hover:text-black hover:border-black transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}
