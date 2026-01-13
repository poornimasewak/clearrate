// components/ui/Logo.tsx
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="w-9 h-9 border-3 border-blue-500 rounded-full relative flex items-center justify-center">
        <span className="text-blue-500 font-bold text-base">$</span>
        <div className="absolute w-0.5 h-3.5 bg-blue-500 -bottom-3 -right-1 rotate-45 rounded" />
      </div>
    </div>
  );
}

