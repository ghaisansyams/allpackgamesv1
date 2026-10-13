export type MascotPose = 'idle' | 'wave' | 'point' | 'proud' | 'celebrate' | 'shock' | 'doh' | 'thinking';

const POSE_SRC: Record<MascotPose, string> = {
    idle: '/images/mascot/idle.png',
    wave: '/images/mascot/wave.png',
    point: '/images/mascot/point.png',
    proud: '/images/mascot/proud.png',
    celebrate: '/images/mascot/celebrate.png',
    shock: '/images/mascot/shock.png',
    doh: '/images/mascot/doh.png',
    thinking: '/images/mascot/thinking.png',
};

export default function Mascot({
    pose,
    className = 'h-32',
    bounce = false,
}: {
    pose: MascotPose;
    className?: string;
    bounce?: boolean;
}) {
    return (
        <img
            src={POSE_SRC[pose]}
            alt=""
            className={`${className} object-contain drop-shadow-xl ${bounce ? 'animate-bounce' : ''}`}
        />
    );
}
