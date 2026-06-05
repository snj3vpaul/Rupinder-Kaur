export function Icon({ name, size = 24 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "leaf":
      return (
        <svg {...common}>
          <path d="M11 20A7 7 0 0 1 4 13c0-5 5-9 13-9 0 8-4 13-9 13Z" />
          <path d="M4 13c4 0 7 0 11-4" />
        </svg>
      );
    case "pan":
      return (
        <svg {...common}>
          <circle cx="11" cy="13" r="6" />
          <path d="M17 13h6" />
          <path d="M8 7c0-1.5 1-2.5 1.5-1S9 7 9 7" />
          <path d="M12 6c0-1.5 1-2.5 1.5-1S13 6 13 6" />
        </svg>
      );
    case "room":
      return (
        <svg {...common}>
          <path d="M3 21V9l9-6 9 6v12" />
          <path d="M9 21v-6h6v6" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common} width={size} height={size}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-10 6L2 7" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "github":
      return (
        <svg {...common}>
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-1-2.6c3-.3 6-1.5 6-6.6a5.1 5.1 0 0 0-1.4-3.5 4.8 4.8 0 0 0-.1-3.5s-1.1-.3-3.6 1.4a12.3 12.3 0 0 0-6.6 0C6.7 1.5 5.6 1.8 5.6 1.8a4.8 4.8 0 0 0-.1 3.5A5.1 5.1 0 0 0 4 8.8c0 5 3 6.3 6 6.6a3.4 3.4 0 0 0-1 2.6V22" />
        </svg>
      );
    case "doc":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8M8 17h8" />
        </svg>
      );
    case "star":
      return (
        <svg {...common} width={18} height={18}>
          <path d="m12 2 3 6.5 7 .8-5 4.8 1.3 6.9L12 17.8 5.4 21l1.3-6.9-5-4.8 7-.8Z" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common} width={16} height={16}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    default:
      return null;
  }
}
