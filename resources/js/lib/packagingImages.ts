export type WasteCategory = 'recyclable' | 'compostable' | 'general';

export interface PackagingImage {
    src: string;
    label: string;
    category: WasteCategory;
}

/**
 * Shared across Memory Match and Recycle Rush so both games show the same product set.
 * Categories are simplified for gameplay (one clear right bin per item), not a definitive
 * recycling guide.
 */
export const PACKAGING_IMAGES: PackagingImage[] = [
    { src: '/images/packaging/food-box.jpg', label: 'Food Box', category: 'recyclable' },
    { src: '/images/packaging/enze-shield.jpg', label: 'Enze Shield', category: 'general' },
    { src: '/images/packaging/popcorn-forepak.jpg', label: 'Popcorn Box', category: 'recyclable' },
    { src: '/images/packaging/foopak-cup.jpg', label: 'Foopak Cup', category: 'compostable' },
    { src: '/images/packaging/elbow-macaroni.jpg', label: 'Macaroni Box', category: 'general' },
    { src: '/images/packaging/foopak-bag.jpg', label: 'Foopak Bag', category: 'compostable' },
    { src: '/images/packaging/baking-paper.jpg', label: 'Baking Paper', category: 'compostable' },
    { src: '/images/packaging/cinema-time.jpg', label: 'Cinema Time', category: 'recyclable' },
];
