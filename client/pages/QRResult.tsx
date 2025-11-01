import { useLocation, useNavigate } from "react-router-dom";
import { Download, Share2, Home } from "lucide-react";
import { useState } from "react";

export default function QRResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [shareLoading, setShareLoading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const { qrCodeUrl, inputText } = location.state || {};

  if (!qrCodeUrl) {
    navigate("/");
    return null;
  }

  const downloadQRCode = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-code-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  const shareQRCode = async () => {
    setShareLoading(true);
    try {
      // Fetch the QR code as blob and share it
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const file = new File([blob], `qr-code-${Date.now()}.png`, {
        type: "image/png",
      });

      if (navigator.share) {
        await navigator.share({
          title: "QRafted - QR Code",
          text: `Check out this QR code: ${inputText}`,
          files: [file],
        });
      } else {
        // Fallback: copy link to clipboard
        const shareUrl = `${window.location.origin}?qr=${encodeURIComponent(qrCodeUrl)}`;
        await navigator.clipboard.writeText(shareUrl);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing QR code:", error);
      // Fallback: copy text to clipboard
      try {
        await navigator.clipboard.writeText(inputText);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      } catch {
        console.error("Could not share or copy");
      }
    } finally {
      setShareLoading(false);
    }
  };

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
          <p className="mt-2 text-white/70">Your QR code is ready</p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="w-full max-w-lg space-y-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-white/20 backdrop-blur-sm">
              <img
                src={qrCodeUrl}
                alt="Generated QR Code"
                className="w-72 h-72 max-w-full"
              />
            </div>

            {inputText && (
              <div className="text-center">
                <p className="text-white/70 text-sm mb-2">Encoded Text/URL:</p>
                <p className="text-white font-medium break-words max-w-xs">
                  {inputText}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
              <button
                onClick={downloadQRCode}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all hover:shadow-lg active:scale-95"
              >
                <Download className="w-5 h-5" />
                Download
              </button>

              <button
                onClick={shareQRCode}
                disabled={shareLoading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-all hover:shadow-lg active:scale-95 disabled:opacity-50"
              >
                <Share2 className="w-5 h-5" />
                {shareLoading ? "Sharing..." : shareCopied ? "Copied!" : "Share"}
              </button>

              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all hover:shadow-lg active:scale-95 backdrop-blur-sm border border-white/20"
              >
                <Home className="w-5 h-5" />
                Home
              </button>
            </div>
          </div>
        </div>
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
