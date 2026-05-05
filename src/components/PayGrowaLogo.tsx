import { useNavigate } from "react-router-dom";

interface PayGrowaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
}

export default function PayGrowaLogo({ className = "", size = "md", clickable = true }: PayGrowaLogoProps) {
  const navigate = useNavigate();

  const sizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  const aSize = {
    sm: { w: 10, h: 12, bar: 3 },
    md: { w: 12, h: 14, bar: 3.5 },
    lg: { w: 16, h: 19, bar: 4.5 },
  };

  const { w, h, bar } = aSize[size];

  const content = (
    <span className={`inline-flex items-baseline font-extrabold tracking-tight ${sizeClasses[size]} ${className}`}>
      <span className="text-primary">Pay</span>
      <span className="text-secondary">Grow</span>
      <svg
        width={w}
        height={h}
        viewBox="0 0 16 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block relative"
        style={{ marginBottom: "-1px" }}
        aria-label="a"
      >
        {/* Triangular A shape */}
        <path
          d="M8 1L15 14H1L8 1Z"
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Horizontal bar under the triangle */}
        <line
          x1="3"
          y1={14 + bar}
          x2="13"
          y2={14 + bar}
          stroke="hsl(var(--secondary))"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );

  if (!clickable) return content;

  return (
    <button onClick={() => navigate("/")} className="tap-scale focus:outline-none" aria-label="Go to home">
      {content}
    </button>
  );
}
