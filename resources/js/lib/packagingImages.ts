export interface PackagingImage {
    src: string;
    label: string;
}

/** Shared across Memory Match and Packaging Rush so both games show the same product set. */
export const PACKAGING_IMAGES: PackagingImage[] = [
    { src: '/images/packaging/food-box.jpg', label: 'Food Box' },
    { src: '/images/packaging/enze-shield.jpg', label: 'Enze Shield' },
    { src: '/images/packaging/popcorn-forepak.jpg', label: 'Popcorn Box' },
    { src: '/images/packaging/foopak-cup.jpg', label: 'Foopak Cup' },
    { src: '/images/packaging/elbow-macaroni.jpg', label: 'Macaroni Box' },
    { src: '/images/packaging/foopak-bag.jpg', label: 'Foopak Bag' },
    { src: '/images/packaging/baking-paper.jpg', label: 'Baking Paper' },
    { src: '/images/packaging/cinema-time.jpg', label: 'Cinema Time' },
];
