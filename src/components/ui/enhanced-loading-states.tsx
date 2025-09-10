import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PerformanceSkeleton } from './performance-skeleton';

interface EnhancedLoadingProps {
  variant?: 'hero' | 'gallery' | 'card' | 'list' | 'modal';
  className?: string;
  showProgress?: boolean;
  progress?: number;
  message?: string;
}

interface LoadingConfig {
  container: string;
  content?: string;
  elements: Array<{
    type: string;
    className: string;
    delay?: number;
  }>;
}

const loadingVariants: Record<string, LoadingConfig> = {
  hero: {
    container: "h-screen bg-gradient-to-br from-muted/20 to-muted/40",
    content: "absolute bottom-8 left-8 right-8",
    elements: [
      { type: 'text', className: 'h-8 w-2/3 mb-4' },
      { type: 'text', className: 'h-12 w-1/2 mb-6' },
      { type: 'button', className: 'h-12 w-40 mr-4' },
      { type: 'button', className: 'h-12 w-36' }
    ]
  },
  gallery: {
    container: "grid grid-cols-2 lg:grid-cols-4 gap-4",
    elements: Array.from({ length: 8 }, (_, i) => ({ 
      type: 'image', 
      className: 'aspect-video rounded-lg',
      delay: i * 0.1 
    }))
  },
  card: {
    container: "space-y-4",
    elements: [
      { type: 'image', className: 'aspect-video w-full rounded-lg' },
      { type: 'text', className: 'h-6 w-3/4' },
      { type: 'text', className: 'h-4 w-1/2' },
      { type: 'button', className: 'h-10 w-24 mt-4' }
    ]
  },
  list: {
    container: "space-y-3",
    elements: Array.from({ length: 5 }, () => ({ 
      type: 'text', 
      className: 'h-16 w-full rounded-lg' 
    }))
  },
  modal: {
    container: "space-y-6 p-6",
    elements: [
      { type: 'text', className: 'h-8 w-2/3' },
      { type: 'text', className: 'h-32 w-full' },
      { type: 'button', className: 'h-10 w-24' }
    ]
  }
};

export const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({
  variant = 'card',
  className,
  showProgress = false,
  progress = 0,
  message
}) => {
  const config = loadingVariants[variant];

  return (
    <div className={cn(config.container, className)}>
      {config.content && (
        <div className={config.content}>
          {config.elements.map((element, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: element.delay || index * 0.1,
                duration: 0.5 
              }}
            >
              <PerformanceSkeleton
                variant={element.type as any}
                className={element.className}
              />
            </motion.div>
          ))}
        </div>
      )}
      
      {!config.content && config.elements.map((element, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: element.delay || index * 0.1,
            duration: 0.4 
          }}
        >
          <PerformanceSkeleton
            variant={element.type as any}
            className={element.className}
          />
        </motion.div>
      ))}

      {showProgress && (
        <motion.div 
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {message && (
              <span className="text-sm text-muted-foreground">{message}</span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Progressive loading component
export const ProgressiveLoader: React.FC<{
  children: React.ReactNode;
  isLoading: boolean;
  variant?: EnhancedLoadingProps['variant'];
  loadingMessage?: string;
}> = ({ 
  children, 
  isLoading, 
  variant = 'card',
  loadingMessage
}) => {
  if (isLoading) {
    return <EnhancedLoading variant={variant} message={loadingMessage} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};