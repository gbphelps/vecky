import ScreenManager from './screenManager';
import LayerManager from './entities/layers/layerManager';
import MousePosition from './mousePosition';
import Registry from './entities/registry';
import Point from './entities/points/point';
import Shape from './entities/shape';
import IntersectionsRegistry from './intersectionsRegistry';
import GridManager from './gridManager';

interface TContext {
    root: SVGSVGElement;
    screenManager: ScreenManager;
    layerManager: LayerManager;
    mousePosition: MousePosition;
    pointRegistry: Registry<Point>
    shapeRegistry: Registry<Shape>
    intersectionsRegistry: IntersectionsRegistry
    gridManager: GridManager
}

export type { TContext };
