import Image from "next/image";

type BrandIconProps = {
  className?: string;
  udsBadge?: boolean;
};

function BrandIcon({
  src,
  className = "h-6 w-6",
  udsBadge = false,
}: BrandIconProps & { src: string }) {
  return (
    <span
      className={`relative inline-flex shrink-0 overflow-visible ${className}`}
      aria-hidden
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="40px"
        className="rounded-[28%] object-cover"
      />
      {udsBadge && (
        <Image
          src="/icons/uds.webp"
          alt=""
          width={16}
          height={16}
          className="absolute -bottom-1 -right-1 z-10 h-[42%] w-[42%] rounded-[28%] border-2 border-white bg-white object-cover shadow-md"
        />
      )}
    </span>
  );
}

export function MaxIcon({
  className = "h-6 w-6",
  udsBadge = false,
}: BrandIconProps) {
  return (
    <BrandIcon
      src="/icons/max.svg"
      className={className}
      udsBadge={udsBadge}
    />
  );
}

export function TelegramIcon({
  className = "h-6 w-6",
  udsBadge = false,
}: BrandIconProps) {
  return (
    <BrandIcon
      src="/icons/telegram.svg"
      className={className}
      udsBadge={udsBadge}
    />
  );
}

export function VkIcon({
  className = "h-6 w-6",
  udsBadge = false,
}: BrandIconProps) {
  return (
    <BrandIcon
      src="/icons/vk.svg"
      className={className}
      udsBadge={udsBadge}
    />
  );
}

export function UdsIcon({ className = "h-6 w-6" }: BrandIconProps) {
  return <BrandIcon src="/icons/uds.webp" className={className} />;
}
