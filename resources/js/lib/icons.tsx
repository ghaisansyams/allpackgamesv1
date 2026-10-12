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
    Gift,
    HelpCircle,
    Zap,
    Brain,
    Eye,
    RotateCw,
    PlusCircle,
    Trophy,
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
    lucky_pack: Gift,
    pack_quiz: HelpCircle,
    pack_challenge: Zap,
    pack_smart: Brain,
    mystery_pack: Eye,
    spin_again: RotateCw,
    bonus_pack: PlusCircle,
    jackpot: Trophy,
};

export default function Icon({ name, className = 'h-8 w-8' }: { name: string; className?: string }) {
    const Component = ICONS[name] ?? Star;
    return <Component className={className} />;
}
