interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index + 1 <= currentStep ? "bg-[#0288d1] text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <div className="text-xs mt-1 text-center">
              {index === 0 && "Información General"}
              {index === 1 && "Verificación de Elementos"}
              {index === 2 && "Evidencia Fotográfica"}
              {index === 3 && "Resumen"}
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-2">
        <div className="absolute top-0 h-1 bg-gray-200 w-full rounded"></div>
        <div
          className="absolute top-0 h-1 bg-green-500 rounded transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>

        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`absolute top-0 w-4 h-4 rounded-full -ml-2 -mt-1.5 ${
              index + 1 <= currentStep ? "bg-green-500" : "bg-gray-200"
            }`}
            style={{ left: `${(index / (totalSteps - 1)) * 100}%` }}
          ></div>
        ))}
      </div>
    </div>
  )
}
