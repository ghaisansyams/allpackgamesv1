import {
    Coffee,
    Cookie,
    Utensils,
    Droplet,
    Pill,
    Sparkles,
    Shield,
    Hourglass,
    Coins,
    Leaf,
    Hand,
    Star,
    LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
    coffee: Coffee,
    cookie: Cookie,
    utensils: Utensils,
    droplet: Droplet,
    pill: Pill,
    sparkles: Sparkles,
    shield: Shield,
    hourglass: Hourglass,
    coins: Coins,
    leaf: Leaf,
    hand: Hand,
    star: Star,
};

export default function Icon({ name, className = 'h-8 w-8' }: { name: string; className?: string }) {
    const Component = ICONS[name] ?? Star;
    return <Component className={className} />;
}
