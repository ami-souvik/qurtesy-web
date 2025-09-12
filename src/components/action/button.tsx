import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/tailwind';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const buttonVariants = {
  primary: 'bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800',
  secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600',
  outline: 'border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800',
  ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
  destructive: 'bg-red-600 hover:bg-red-700',
};

const sizeVariants = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 py-2',
  lg: 'h-12 px-6 text-lg',
  icon: 'h-10 w-10 p-0',
};

export const Button = ({
  className,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) => (
  <button
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      buttonVariants[variant],
      sizeVariants[size],
      className
    )}
    onClick={onClick}
    disabled={disabled || loading}
    {...props}
  >
    <div className="flex items-center justify-center">
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {leftIcon && !loading && leftIcon}
      {children}
      {rightIcon && !loading && rightIcon}
    </div>
  </button>
);
