import Vec2 from '../utils/vec2';

class InputStateManager {
  dragStartVector: Vec2 | null;
  dragVector: Vec2 | null;
  mouseDownVector: Vec2 | null;
  selectedElement: SVGElement | null;
  wasDragged: boolean;

  constructor() {
    this.dragStartVector = null;
    this.dragVector = null;
    this.mouseDownVector = null;
    this.selectedElement = null;
    this.wasDragged = false;
  }
}

export default InputStateManager;
