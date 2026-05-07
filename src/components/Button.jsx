export default function Button({
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    onClick,
    type = "button",
    className = "",
    ...props
}) {
    const sizeClass = {
        sm: "btn-sm",
        md: "",
        lg: "btn-lg",
    }[size];

    return (
        <button
            type={type}
            className={`btn btn-${variant} ${sizeClass} ${className}`}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
}
