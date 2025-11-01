import { useState, useRef, useEffect } from "react";
import { Download, Copy, Check, Upload } from "lucide-react";

export default function QRCodeGenerator() {
  const [input, setInput] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const generateQRCode = async (text: string) => {
    if (!text.trim()) {
      setQrCode("");
      return;
    }

    setLoading(true);
    try {
      const encodedText = encodeURIComponent(text);
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedText}`);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      generateQRCode(input);
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  const downloadQRCode = async () => {
    if (!qrCode) return;

    try {
      const response = await fetch(qrCode);
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

  const copyToClipboard = async () => {
    if (!input) return;

    try {
      await navigator.clipboard.writeText(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setInput(content.trim());
        }
      };

      reader.onerror = () => {
        console.error("Error reading file");
      };

      if (file.type.startsWith("text/")) {
        reader.readAsText(file);
      } else {
        console.error("Please drop a text file");
      }
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="space-y-8">
        <div>
          <label htmlFor="qr-input" className="block text-sm font-medium text-white mb-3">
            Enter text or URL
          </label>
          <input
            id="qr-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type something..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-white placeholder:text-white/50 backdrop-blur-sm"
          />
        </div>

        {qrCode && (
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-lg border border-white/20 backdrop-blur-sm">
              <img
                src={qrCode}
                alt="Generated QR Code"
                className="w-80 h-80 max-w-full"
              />
            </div>

            <div className="flex gap-3 flex-wrap justify-center">
              <button
                onClick={downloadQRCode}
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-all hover:shadow-lg active:scale-95"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all hover:shadow-lg active:scale-95 backdrop-blur-sm border border-white/20"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Text
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {loading && input && !qrCode && (
          <div className="flex justify-center py-8">
            <div className="animate-spin">
              <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full" />
            </div>
          </div>
        )}

        {!input && (
          <div className="text-center py-12 text-white/60">
            <p className="text-sm">Enter text or a URL to generate a QR code</p>
          </div>
        )}
      </div>
    </div>
  );
}
