import { LucideProps } from 'lucide-react';
import React, { ComponentType } from 'react';

export interface ConnectionBadgeConfigItemProps {
    label: string;
    fontColor: string;
    backgroundColor: string;
    icon: ComponentType<LucideProps>;
}
