
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
      <main className="min-h-screen bg-[#1B1B1B] flex items-center justify-center px-4 py-8 text-white">
        {children}
      </main>
  );
}
