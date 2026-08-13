import Image from "next/image";

export default function ProductImage({ src, alt = "", emojiClassName = "" }) {
  if (typeof src === "string" && /^https?:\/\//.test(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 400px"
        className="object-cover"
      />
    );
  }
  return (
    <span
      className={`flex h-full w-full items-center justify-center select-none ${emojiClassName}`}
    >
      {src || "📦"}
    </span>
  );
}