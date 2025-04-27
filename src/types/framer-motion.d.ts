import { HTMLMotionProps } from 'framer-motion';

declare module 'framer-motion' {
  export interface HTMLMotionProps<T> extends React.HTMLAttributes<T> {
    className?: string;
  }
} 