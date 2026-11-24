type ArrowUpRightProps = { size?: number };

export default function ArrowUpRight({ size = 18 }: ArrowUpRightProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#79c5f3"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ display: "inline-block", verticalAlign: "-0.18em", flexShrink: 0 }}
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
