import QRCodeGenerator from "@/components/QRCodeGenerator";

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            QR Code Generator
          </h1>
          <p className="mt-2 text-muted-foreground">
            Convert any text or URL into a QR code instantly
          </p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <QRCodeGenerator />
      </main>

      <footer className="border-t border-border mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Free, fast, and secure QR code generation
          </p>
        </div>
      </footer>
    </div>
  );
}
