import { CustomMouseDownEvent } from './events/EventsInterface';
import Tool from './tools/tool';
import PenTool from './tools/penTool';
import UpdatePointTool from './tools/updatePointTool';
import { TContext } from './types';
import Anchor from './entities/points/anchor';
import Handle from './entities/points/handle';

type ToolUnion = |
    typeof PenTool |
    typeof UpdatePointTool

class ToolManager extends Tool {
  activeTool: Tool | null;
  ctx: TContext;

  constructor(args: TContext) {
    super(args);
    this.activeTool = null;
    this.ctx = args;
  }

  setTool<T extends ToolUnion>(ToolClass: T, toolArgs?: ConstructorParameters<T>[1]) {
    this.activeTool?.destroy();

    this.activeTool = new ToolClass(
      this.ctx,
      toolArgs,
    );
  }

  handleAnchorClick(element: Anchor) {
    if (this.activeTool instanceof PenTool && !element.isEdge()) {
      this.setTool(UpdatePointTool, element);
    }
  }

  handleHandleClick(element: Handle) {
    this.setTool(UpdatePointTool, element);
  }

  onMouseDown(e: CustomMouseDownEvent): void {
    if (e.element instanceof Anchor) {
      this.handleAnchorClick(e.element);
    } else if (e.element instanceof Handle) {
      this.handleHandleClick(e.element);
    }
  }
}

export default ToolManager;
