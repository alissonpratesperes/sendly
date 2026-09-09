export interface CardProps {
    id: number;
    images: string[];
    date: Date;
    ta: string | undefined;
    product: string | undefined;
    location: string | undefined;
    chain: string | undefined;
};