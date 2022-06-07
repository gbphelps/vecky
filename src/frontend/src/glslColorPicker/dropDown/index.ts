import PubSub from '../statefulPubsub';
import styles from './styles.module.scss';

class DropDown {
  options:{value: string, label: string}[];
  container: HTMLDivElement;
  button: HTMLButtonElement;
  publisher: PubSub<string>;
  menu: HTMLDivElement;
  menuContainer: HTMLDivElement;

  constructor({
    root, options, publisher,
  }:{
      root: HTMLElement,
      options: {value: string, label: string}[],
      publisher: PubSub<string>
    }) {
    this.publisher = publisher;
    this.options = options;
    this.container = document.createElement('div');

    this.button = document.createElement('button');
    this.button.classList.add(styles['dd-button-main']);

    root.appendChild(this.container);
    this.container.appendChild(this.button);

    this.publisher.subscribe((v) => {
      this.button.innerText = v;
    });

    this.menuContainer = document.createElement('div');

    this.container.appendChild(this.menuContainer);

    this.menu = document.createElement('div');
    this.menuContainer.appendChild(this.menu);

    this.container.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    document.addEventListener('click', this.close);

    Object.assign(this.menuContainer.style, {
      display: 'block',
      position: 'fixed',
      zIndex: 2,
      background: 'white',
      border: '1px solid rgba(0,0,0,.1)',
      borderRadius: '3px',
      borderTop: 'none',
      height: '0',
      transition: 'height .1s, visibility .1s',
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0,
      overflow: 'hidden',
      visibility: 'hidden',
    });

    this.button.addEventListener('click', () => {
      const { bottom, left, width } = this.button.getBoundingClientRect();
      const isExpanded = this.menuContainer.style.visibility === 'visible';

      if (isExpanded) {
        this.close();
        return;
      }

      Object.assign(this.button.style, {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      });

      Object.assign(this.menuContainer.style, {
        top: `${bottom}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${this.menu.getBoundingClientRect().height}px`,
        visibility: 'visible',
      });
    });

    options.forEach((o) => {
      const button = document.createElement('button');
      button.value = o.value;
      button.innerText = o.label;
      Object.assign(button.style, {
        padding: '8px',
        border: 'none',
        outline: 'none',
        background: 'none',
        display: 'block',
        width: '100%',
        textAlign: 'left',
      });

      this.publisher.subscribe((opt) => {
        Object.assign(button.style, {
          background: opt === o.label ? '#fafaff' : 'white',
          color: opt === o.label ? 'dodgerblue' : 'black',
        });
      });

      button.addEventListener('click', () => {
        this.publisher.set(o.value);
        this.close();
      });

      this.menu.appendChild(button);
    });
  }

  close = () => {
    Object.assign(this.button.style, {
      borderBottomLeftRadius: '3px',
      borderBottomRightRadius: '3px',
    });

    Object.assign(this.menuContainer.style, {
      height: 0,
      visibility: 'hidden',
    });

    document.removeEventListener('click', this.close);
  };
}

export { DropDown };
