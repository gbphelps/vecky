import Vec2 from '../../utils/vec2';
import Point from './point';

interface IHandle extends Point {
    setPosition: (a: Vec2) => void
    receivePosition: (a: Vec2) => void
    side: 'prev' | 'next'
}

interface IAnchor extends Point {
    handlePositions: {
        prev: Vec2 | undefined,
        next: Vec2 | undefined
    }
    setHandle(type: 'next' | 'prev', pos: Vec2): void
}

export type { IHandle, IAnchor };
