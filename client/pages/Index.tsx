import QRCodeGenerator from "@/components/QRCodeGenerator";

export default function Index() {
  return (
    <div className="min-h-screen gradient-background flex flex-col">
      <div className="floating-orb floating-orb-1"></div>
      <div className="floating-orb floating-orb-2"></div>
      <div className="floating-orb floating-orb-3"></div>
      <div className="floating-orb floating-orb-4"></div>

      <header className="border-b border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="text-orange-500">QR</span>
            <span className="text-white">afted</span>
          </h1>
          <p className="mt-2 text-white/70">Beautifully crafted codes</p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <QRCodeGenerator />
      </main>

      <footer className="border-t border-white/10 bg-black/30 backdrop-blur-sm mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-sm text-white/70">
            Free, fast, and secure QR code generation
          </p>
        </div>
      </footer>
    </div>
  );
}
