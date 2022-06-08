interface DragParams {
    rootBox: {
      width: number,
      height: number,
    }, mouse: {
      x: number, y: number,
    },
}

abstract class Pip {
  element: HTMLDivElement;
  position: HTMLDivElement;
  root: HTMLDivElement;
  offsetX: number;
  offsetY: number;

    // colorPublisher: ColorPublisher;
    abstract dragCallback(arg: DragParams): void
    abstract destroy(): void;

    onMouseMove = (e: MouseEvent) => {
      const {
        height, width, top, left,
      } = this.root.getBoundingClientRect();

      this.dragCallback({
        rootBox: {
          height, width,
        },
        mouse: {
          x: e.x - this.offsetX + this.element.getBoundingClientRect().width / 2 - left,
          y: e.y - this.offsetY + this.element.getBoundingClientRect().height / 2 - top,
        },
      });
    };

    constructor({ root }: {
      root: HTMLDivElement,
    }) {
      this.position = document.createElement('div');
      this.element = document.createElement('div');
      this.root = root;
      this.offsetX = 0;
      this.offsetY = 0;

      root.appendChild(this.position);
      this.position.appendChild(this.element);

      this.element.addEventListener('dragstart', (e) => {
        e.stopPropagation();
        e.preventDefault();
      });
      this.element.addEventListener('dragover', (e) => {
        e.stopPropagation();
        e.preventDefault();
      });
      this.element.addEventListener('dragleave', (e) => {
        e.stopPropagation();
        e.preventDefault();
      });
      this.element.addEventListener('dragover', (e) => {
        e.stopPropagation();
        e.preventDefault();
      });
      this.element.addEventListener('dragend', (e) => {
        e.stopPropagation();
        e.preventDefault();
      });
      this.element.addEventListener('dragenter', (e) => {
        e.stopPropagation();
        e.preventDefault();
      });
      this.element.addEventListener('drag', (e) => {
        e.stopPropagation();
        e.preventDefault();
      });

      this.element.addEventListener('mousedown', ({ offsetX, offsetY }) => {
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', () => {
          document.removeEventListener('mousemove', this.onMouseMove);
        }, { once: true });
      });
    }
}

export { Pip };
export type { DragParams };
