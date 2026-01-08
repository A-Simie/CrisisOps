import { forwardRef, type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'bordered' | 'danger';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    interactive?: boolean;
}

const variantStyles = {
    default: 'bg-bg-secondary',
    elevated: 'bg-bg-secondary shadow-lg shadow-black/20',
    bordered: 'bg-bg-secondary border border-bg-tertiary',
    danger: 'bg-danger/10 border border-danger/30',
};

const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({
        variant = 'default',
        padding = 'md',
        interactive = false,
        className = '',
        children,
        ...props
    }, ref) => {
        return (
            <div
                ref={ref}
                className={`
          rounded-[--radius-lg]
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${interactive ? 'cursor-pointer hover:bg-bg-tertiary transition-colors active:scale-[0.98] transition-transform' : ''}
          ${className}
        `}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

// Card sub-components
export function CardHeader({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`flex items-center justify-between mb-3 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className={`text-lg font-semibold text-text-primary ${className}`} {...props}>
            {children}
        </h3>
    );
}

export function CardDescription({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={`text-sm text-text-secondary ${className}`} {...props}>
            {children}
        </p>
    );
}

export function CardContent({
    className = '',
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={className} {...props}>
            {children}
        </div>
    );
}
