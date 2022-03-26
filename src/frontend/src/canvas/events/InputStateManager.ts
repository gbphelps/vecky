import Vec2 from '../utils/vec2';

class InputStateManager {
  dragStartVector: Vec2 | null;
  dragVector: Vec2 | null;
  mouseDownVector: Vec2 | null;
  selectedElement: SVGElement | null;

  constructor() {
    this.dragStartVector = null;
    this.dragVector = null;
    this.mouseDownVector = null;
    this.selectedElement = null;
  }
}

export default InputStateManager;
