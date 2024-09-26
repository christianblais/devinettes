import data from './data.mjs';
import './util.mjs';

export class Card extends HTMLElement {
  static observedAttributes = ['template', 'side-a', 'side-b'];

  /**
   * The HTML used to render the card
   * @type string
   */
  #template;

  /**
   * The text shown on the front face of the card
   * @type string
   */
  #sideA;

  /**
   * The text shown on the back face of the card
   * @type string
   */
  #sideB;

  attributeChangedCallback(name, _, value) {
    switch (name) {
      case 'template':
        this.#template = document.querySelector(`#${value}`).content;
        break;
      case 'side-a':
        this.#sideA = value;
        break;
      case 'side-b':
        this.#sideB = value;
        break;
    }
  }

  connectedCallback() {
    this.addEventListener('click', this.flip);

    const content = this.#template.cloneNode(true);

    content.querySelector('slot[name="side-a"]').replaceWith(this.#sideA);
    content.querySelector('slot[name="side-b"]').replaceWith(this.#sideB);

    this.append(content);
  }

  flip() {
    this.classList.toggle('flipped');
  }

  discard(side) {
    this.addEventListener('animationend', this.remove, { once: true });
    this.classList.add(`discard-${side}`);
  }
}

export class App extends HTMLElement {
  connectedCallback() {
    this.$deck = this.querySelector('deck');

    this.querySelector('#next').addEventListener('click', this.#next.bind(this));
    this.querySelector('#back').addEventListener('click', this.#back.bind(this));

    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        this.#next();
      }

      if (event.key === 'ArrowLeft') {
        this.#back();
      }

      if (event.key === ' ') {
        event.preventDefault();
        this.$card.flip();
      }
    });

    window.addEventListener('touchstart', (touchStartEvent) => {
      window.addEventListener('touchend', (touchEndEvent) => {
        const diffX = touchEndEvent.changedTouches[0].screenX - touchStartEvent.changedTouches[0].screenX;

        if (Math.abs(diffX) > 50) {
          diffX < 0 ? this.#next() : this.#back();
        }
      }, { once: true });
    });

    this.dictionary = data.toShuffled();
    this.currentIdx = -1;

    this.#next();
  }

  #createCardElement(item) {
    const card = document.createElement('riddle-card');
    card.setAttribute('template', 'card-template');
    card.setAttribute('side-a', item[1]);
    card.setAttribute('side-b', item[0]);
    return card;
  }

  #next() {
    if (this.dictionary.length > this.currentIdx + 1) {
      this.$card?.discard('to-left');
      this.$card = this.#createCardElement(this.dictionary[++this.currentIdx]);
      this.$card.classList.add('play-from-right');
      this.$deck.append(this.$card);
    }
  }

  #back() {
    if (this.currentIdx > 0) {
      this.$card?.discard('to-right');
      this.$card = this.#createCardElement(this.dictionary[--this.currentIdx]);
      this.$card.classList.add('play-from-left');
      this.$deck.append(this.$card);
    }
  }
}
