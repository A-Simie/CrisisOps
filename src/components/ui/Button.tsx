import { forwardRef, type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-accent text-white hover:bg-accent-light active:bg-accent',
    secondary: 'bg-bg-secondary text-text-primary hover:bg-bg-tertiary active:bg-bg-secondary',
    danger: 'bg-danger text-white hover:bg-danger-light active:bg-danger',
    ghost: 'bg-transparent text-text-secondary hover:bg-bg-secondary active:bg-bg-tertiary',
    outline: 'bg-transparent border border-bg-tertiary text-text-primary hover:bg-bg-secondary active:bg-bg-tertiary',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'h-9 px-3 text-sm rounded-[--radius-sm]',
    md: 'h-12 px-4 text-base rounded-[--radius-md]',
    lg: 'h-14 px-6 text-lg rounded-[--radius-lg]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        variant = 'primary',
        size = 'md',
        fullWidth = false,
        loading = false,
        className = '',
        disabled,
        children,
        ...props
    }, ref) => {
        return (
            <button
                ref={ref}
                className={`
          inline-flex items-center justify-center gap-2
          font-medium transition-colors duration-150
          min-h-[--spacing-touch]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
