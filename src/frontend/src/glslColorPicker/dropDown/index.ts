import PubSub from '../statefulPubsub';
import styles from './styles.module.scss';

class DropDown {
  options:{value: string, label: string}[];
  container: HTMLDivElement;
  button: HTMLButtonElement;
  publisher: PubSub<string>;
  menu: HTMLDivElement;

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

    this.menu = document.createElement('div');
    root.appendChild(this.menu);

    options.forEach((o) => {
      const button = document.createElement('button');
      button.value = o.value;
      button.innerText = o.label;

      button.addEventListener('click', () => {
        this.publisher.set(o.value);
      });
      this.menu.appendChild(button);
    });
  }
}

export { DropDown };
