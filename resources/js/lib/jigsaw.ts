/**
 * Classic interlocking jigsaw piece shapes, built from SVG bezier "knobs" rather than plain
 * rectangles. Each internal edge of the grid gets one random tab direction, shared by the two
 * pieces on either side of it — because they're traversed in opposite directions when their
 * paths are built, the same shared value naturally produces a matching tab/socket pair.
 */

export interface JigsawTabs {
    /** hTabs[r][c]: tab for the horizontal edge above piece (r, c), r = 1..grid-1. */
    hTabs: number[][];
    /** vTabs[r][c]: tab for the vertical edge left of piece (r, c), c = 1..grid-1. */
    vTabs: number[][];
}

export function generateJigsawTabs(grid: number): JigsawTabs {
    const hTabs: number[][] = [];
    const vTabs: number[][] = [];
    for (let r = 1; r < grid; r++) {
        hTabs[r] = [];
        for (let c = 0; c < grid; c++) hTabs[r][c] = Math.random() > 0.5 ? 1 : -1;
    }
    for (let r = 0; r < grid; r++) {
        vTabs[r] = [];
        for (let c = 1; c < grid; c++) vTabs[r][c] = Math.random() > 0.5 ? 1 : -1;
    }
    return { hTabs, vTabs };
}

function edgeTo(x1: number, y1: number, x2: number, y2: number, tab: number): string {
    if (tab === 0) return `L ${x2},${y2}`;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy;
    const py = ux;
    const depth = len * 0.22 * tab;

    const pt = (frac: number, offset: number): [number, number] => [
        x1 + ux * len * frac + px * offset,
        y1 + uy * len * frac + py * offset,
    ];

    const p1 = pt(0.32, 0);
    const p2 = pt(0.3, depth * 0.9);
    const p3 = pt(0.4, depth * 1.35);
    const p4 = pt(0.5, depth * 1.35);
    const p5 = pt(0.6, depth * 1.35);
    const p6 = pt(0.7, depth * 0.9);
    const p7 = pt(0.68, 0);

    return [
        `L ${p1[0]},${p1[1]}`,
        `C ${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${p4[0]},${p4[1]}`,
        `C ${p5[0]},${p5[1]} ${p6[0]},${p6[1]} ${p7[0]},${p7[1]}`,
        `L ${x2},${y2}`,
    ].join(' ');
}

/**
 * The piece's path, drawn in a local coordinate box of size `pad*2 + pieceSize` square, with
 * the nominal piece square positioned at (pad, pad) to (pad+pieceSize, pad+pieceSize) — tabs
 * bulge into that padding margin without ever being clipped by the piece's own SVG viewport.
 */
export function jigsawPiecePath(
    row: number,
    col: number,
    grid: number,
    pieceSize: number,
    pad: number,
    tabs: JigsawTabs,
): string {
    const x0 = pad;
    const y0 = pad;
    const x1 = pad + pieceSize;
    const y1 = pad + pieceSize;

    const topTab = row === 0 ? 0 : tabs.hTabs[row][col];
    const rightTab = col === grid - 1 ? 0 : tabs.vTabs[row][col + 1];
    const bottomTab = row === grid - 1 ? 0 : tabs.hTabs[row + 1][col];
    const leftTab = col === 0 ? 0 : tabs.vTabs[row][col];

    return [
        `M ${x0},${y0}`,
        edgeTo(x0, y0, x1, y0, topTab),
        edgeTo(x1, y0, x1, y1, rightTab),
        edgeTo(x1, y1, x0, y1, bottomTab),
        edgeTo(x0, y1, x0, y0, leftTab),
        'Z',
    ].join(' ');
}

export function shuffledPositions(count: number): number[] {
    const positions = Array.from({ length: count }, (_, i) => i);
    do {
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
    } while (positions.every((v, i) => v === i) && count > 1);
    return positions;
}
