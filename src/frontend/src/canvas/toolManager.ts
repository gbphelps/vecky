import { CustomMouseDownEvent } from './events/EventsInterface';
import Tool from './tools/tool';
import PenTool from './tools/penTool';
import AnchorTool from './tools/anchorTool';
import { TContext } from './types';
import Anchor from './entities/points/anchor';

type ToolUnion = |
    typeof PenTool |
    typeof AnchorTool

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
      setTimeout(() => this.setTool(AnchorTool, element));
    }
  }

  onMouseDown(e: CustomMouseDownEvent): void {
    if (e.element instanceof Anchor) {
      this.handleAnchorClick(e.element);
    }
  }
}

export default ToolManager;
