interface DragParams {
    rootBox: {
      width: number,
      height: number,
      top: number,
      left: number,
    }, mouse: {
      x: number, y: number,
    },
}

abstract class Pip {
  element: HTMLDivElement;
  position: HTMLDivElement;
  root: HTMLDivElement;
    // colorPublisher: ColorPublisher;
    abstract dragCallback(arg: DragParams): void

    onMouseMove = (e: MouseEvent) => {
      const {
        height, width, top, left,
      } = this.root.getBoundingClientRect();

      this.dragCallback({
        rootBox: {
          height, width, top, left,
        },
        mouse: {
          x: e.x,
          y: e.y,
        },
      });
    };

    constructor({ root }: {
      root: HTMLDivElement,
    }) {
      this.position = document.createElement('div');
      this.element = document.createElement('div');
      this.root = root;

      root.appendChild(this.position);
      this.position.appendChild(this.element);

      this.element.addEventListener('mousedown', () => {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', () => {
          document.removeEventListener('mousemove', this.onMouseMove);
        }, { once: true });
      });
    }
}

export { Pip };
export type { DragParams };
