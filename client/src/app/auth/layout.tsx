export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
        {/* 공통 로고 같은 걸 여기에 넣어도 됩니다 */}
        {children}
      </div>
    </div>
  );
}
