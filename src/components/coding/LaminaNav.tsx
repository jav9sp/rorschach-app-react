type LaminaNavProps = {
  laminas: readonly string[];
  currentIndex: number;
  counts: number[];
  onSelect: (index: number) => void;
};

export default function LaminaNav({
  laminas,
  currentIndex,
  counts,
  onSelect,
}: LaminaNavProps) {
  return (
    <div
      className="flex flex-wrap justify-center gap-2 my-6"
      role="tablist"
      aria-label="Láminas"
    >
      {laminas.map((lam, i) => {
        const isCurrent = i === currentIndex;
        const count = counts[i] ?? 0;

        return (
          <button
            key={lam}
            type="button"
            role="tab"
            aria-selected={isCurrent}
            onClick={() => onSelect(i)}
            className={`relative w-12 h-12 rounded-full border-2 font-semibold transition cursor-pointer flex items-center justify-center ${
              isCurrent
                ? "bg-teal-600 border-teal-600 text-white"
                : count > 0
                  ? "bg-teal-50 border-teal-400 text-teal-700"
                  : "bg-white border-gray-300 text-gray-500 hover:border-teal-400"
            }`}
          >
            {lam}
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[10px] leading-none rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
