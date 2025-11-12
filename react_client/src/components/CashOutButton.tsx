interface CashOutButtonProps {
  onClick?: () => void
  disabled?: boolean
}

export default function CashOutButton({ onClick, disabled = false }: CashOutButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center justify-center aspect-square h-[88px] hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#55DD63] rounded-lg shrink-0"
      style={{ backgroundColor: '#14240C', color: '#55DD63' }}
    >
      <span className="text-xs font-bold">CASH</span>
      <span className="text-xs font-bold">OUT</span>
    </button>
  )
}

