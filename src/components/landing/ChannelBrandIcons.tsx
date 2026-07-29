/** SVG-иконки каналов (без внешних ассетов). */

export function MaxIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="none">
      <rect width="24" height="24" rx="6" fill="#1A1A1A" />
      <path
        d="M6.5 16.5V7.5h2.1l3.4 5.6 3.4-5.6H17.5v9h-2.05v-5.35L12.2 16.5h-1.4l-3.25-5.35v5.35H6.5Z"
        fill="#FFDD2D"
      />
    </svg>
  );
}

export function TelegramIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="none">
      <circle cx="12" cy="12" r="12" fill="#2AABEE" />
      <path
        d="M17.6 7.2 6.9 11.3c-.7.27-.69.66-.13.84l2.75.86 1.06 3.25c.13.4.2.56.44.58.23.02.35-.1.55-.3l1.33-1.29 2.77 2.04c.51.28.87.14 1-.47l1.82-8.57c.19-.76-.29-1.1-.79-.9Z"
        fill="#fff"
      />
    </svg>
  );
}

export function VkIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="none">
      <rect width="24" height="24" rx="6" fill="#0077FF" />
      <path
        d="M12.9 16.7h-.9c-3.5 0-5.5-2.4-5.6-6.4h1.7c.1 2.9 1.3 4.1 2.3 4.3V10.3h1.6v2.4c1 0 2-.9 2.4-2.4h1.5c-.3 1.6-1.5 2.7-2.2 3.1.8.4 2.1 1.6 2.6 3.3h-1.8c-.4-1.2-1.4-2.2-2.6-2.3v2.3Z"
        fill="#fff"
      />
    </svg>
  );
}

/** Стилизованный значок приложения UDS (монограмма, без официального файла логотипа). */
export function UdsIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="none">
      <rect width="24" height="24" rx="6" fill="#0B8F4E" />
      <text
        x="12"
        y="15.5"
        textAnchor="middle"
        fill="#fff"
        fontSize="7.5"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        UDS
      </text>
    </svg>
  );
}
