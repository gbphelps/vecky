import { CustomMouseDownEvent } from './events/EventsInterface';
import Tool from './tools/tool';
import PenTool from './tools/penTool';
import AnchorTool from './tools/anchorTool';
import { TContext } from './types';

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

  setTool<T extends ToolUnion>(
    ToolClass: T,
  ) {
    this.activeTool = new ToolClass(this.ctx);
  }

  onMouseDown(e: CustomMouseDownEvent): void {
    if (this.activeTool instanceof PenTool) {
      console.log('this is pen tool');
    }
  }
}

export default ToolManager;
