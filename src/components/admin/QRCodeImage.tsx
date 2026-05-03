import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Props = {
  value: string;
  size?: number;
  className?: string;
};

const QRCodeImage = ({ value, size = 160, className }: Props) => {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(value, { width: size, margin: 1 }).then(setSrc).catch(() => setSrc(""));
  }, [value, size]);

  if (!src) {
    return (
      <div
        className={className}
        style={{ width: size, height: size, background: "hsl(var(--secondary))" }}
      />
    );
  }
  return <img src={src} alt={`QR for ${value}`} width={size} height={size} className={className} />;
};

export default QRCodeImage;
