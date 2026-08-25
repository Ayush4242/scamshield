export default function Logo({ className = "h-7 w-7" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M16 3.5 6.5 7.2v8.1c0 6.1 4.1 11.1 9.5 13.2 5.4-2.1 9.5-7.1 9.5-13.2V7.2L16 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 16.2 14.6 19.3 20.6 12.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
