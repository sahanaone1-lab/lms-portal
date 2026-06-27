import React, { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn'; // We'll create this utility

// Button Component
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm shadow-primary/20",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border bg-background hover:bg-secondary hover:text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm shadow-destructive/10",
    ghost: "hover:bg-secondary hover:text-secondary-foreground",
    link: "text-primary underline-offset-4 hover:underline bg-transparent p-0 active:scale-100"
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-11 px-8 text-base",
    icon: "h-10 w-10"
  };

  return (
    <button
      className={cn(baseStyle, variants[variant], sizes[size], className)}
      {...props}
    />
  );
};

// Input Component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  className,
  type = 'text',
  label,
  error,
  id,
  ...props
}) => {
  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 font-display">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className={cn(
          "w-full h-10 px-3 py-2 text-sm bg-background border border-border rounded-lg placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200",
          error && "border-destructive focus:ring-destructive",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-destructive animate-fade-in">{error}</p>
      )}
    </div>
  );
};

// Textarea Component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  className,
  label,
  error,
  id,
  ...props
}) => {
  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 font-display">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          "w-full min-h-24 px-3 py-2 text-sm bg-background border border-border rounded-lg placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 resize-y",
          error && "border-destructive focus:ring-destructive",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-destructive animate-fade-in">{error}</p>
      )}
    </div>
  );
};

// Badge Component
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  ...props
}) => {
  const baseStyle = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-display tracking-wide transition-colors duration-200 border";

  const variants = {
    default: "bg-primary border-transparent text-primary-foreground",
    secondary: "bg-secondary border-transparent text-secondary-foreground",
    outline: "border-border text-foreground bg-transparent",
    success: "bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 text-amber-600 dark:text-amber-400",
    destructive: "bg-destructive/10 dark:bg-destructive/20 border-destructive/30 text-destructive dark:text-destructive-foreground"
  };

  return (
    <span className={cn(baseStyle, variants[variant], className)} {...props} />
  );
};

// Card Components
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in", className)} {...props} />
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn("text-xl font-semibold leading-none tracking-tight font-display", className)} {...props} />
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("flex items-center p-6 pt-0 border-t border-border/50 mt-4", className)} {...props} />
);

// Modal/Dialog Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  sizeClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, sizeClassName }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Dialog Content */}
      <div 
        className={`relative w-full ${sizeClassName || 'max-w-lg'} rounded-xl border border-border bg-card shadow-lg glow-indigo animate-fade-in z-10 flex flex-col overflow-hidden`}
        style={{ maxHeight: '90vh' }}
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between border-b border-border/50 p-6 pb-3 flex-shrink-0 bg-[#ffffff] dark:bg-card sticky top-0 z-20">
          {title && <h3 className="text-lg font-bold font-display">{title}</h3>}
          <button
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-auto"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto p-6 pt-0 min-h-0 modal-content-container relative">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

// Custom Select Component
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  className,
  id,
  ...props
}) => {
  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 font-display">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full h-10 pl-3 pr-10 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring appearance-none transition-all duration-200 cursor-pointer",
            error && "border-destructive focus:ring-destructive",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom Arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
          ▼
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-destructive animate-fade-in">{error}</p>
      )}
    </div>
  );
};

// Tabs Component
interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const Tabs: React.FC<{
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}> = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground mb-4", className)}>
      {children}
    </div>
  );
};

export const TabsTrigger: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
}> = ({ value, children, className }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used inside Tabs');

  const isActive = context.activeTab === value;

  return (
    <button
      onClick={() => context.setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        isActive
          ? "bg-background text-foreground shadow-sm font-semibold"
          : "hover:bg-background/50 hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
}> = ({ value, children, className }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used inside Tabs');

  if (context.activeTab !== value) return null;

  return (
    <div className={cn("focus-visible:outline-none animate-fade-in", className)}>
      {children}
    </div>
  );
};
