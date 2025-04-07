import React, { ReactNode } from 'react';
import { Card as ShadcnCard, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

interface CardProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, footer, className = '' }) => {
  return (
    <ShadcnCard className={className}>
      <CardHeader>
        <CardTitle className="text-lg leading-6">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && (
        <CardFooter className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          {footer}
        </CardFooter>
      )}
    </ShadcnCard>
  );
};

export default Card;