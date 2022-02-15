import Vec2 from '../../vec2';
import Point from './point';

interface PointArgs {
    root: SVGElement;
}

interface IHandle extends Point {
    setPosition: (a: Vec2) => void
}

interface IAnchor extends Point {
    handlePositions: {
        prev: Vec2 | undefined,
        next: Vec2 | undefined
    }
}

export type { PointArgs, IHandle, IAnchor };
