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
      className="px-4 py-2 text-white border-2 border-white hover:bg-white hover:text-black hover:border-black transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
      style={{ 
        backgroundColor: '#14240C',
        color: '#55DD63',
        borderColor: '#55DD63'
      }}
    >
      {children}
    </button>
  )
}
