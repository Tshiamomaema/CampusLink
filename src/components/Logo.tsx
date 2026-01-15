interface LogoProps {
    size?: number;
    className?: string;
}

export default function Logo({ size = 32, className = '' }: LogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Graduation cap base */}
            <path
                d="M24 8L4 18L24 28L44 18L24 8Z"
                fill="currentColor"
                opacity="0.9"
            />
            {/* Graduation cap top */}
            <path
                d="M24 28L10 21V32C10 32 16 38 24 38C32 38 38 32 38 32V21L24 28Z"
                fill="currentColor"
                opacity="0.7"
            />
            {/* Connection nodes - left */}
            <circle cx="8" cy="20" r="3" fill="currentColor" />
            {/* Connection nodes - right */}
            <circle cx="40" cy="20" r="3" fill="currentColor" />
            {/* Connection nodes - center bottom */}
            <circle cx="24" cy="42" r="3" fill="currentColor" />
            {/* Connection lines */}
            <path
                d="M11 20L24 28L37 20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.5"
            />
            <path
                d="M24 31V39"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.5"
            />
        </svg>
    );
}
