interface CashOutButtonProps {
  onClick?: () => void
  disabled?: boolean
}

export default function CashOutButton({ onClick, disabled = false }: CashOutButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 border-2 border-white text-white hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
    >
      <span className="text-sm md:text-xl font-bold">CASH OUT</span>
    </button>
  )
}

