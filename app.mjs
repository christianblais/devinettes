import data from './data.mjs';
import './util.mjs';

export class Card extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', this.flip);

    const content = document.querySelector('#card-template').content.cloneNode(true);

    content.querySelector('slot[name="side-a"]').replaceWith(this.getAttribute('side-a'));
    content.querySelector('slot[name="side-b"]').replaceWith(this.getAttribute('side-b'));

    this.append(content);
  }

  flip() {
    if (this.classList.contains('flipped')) {
      this.classList.remove('flipped');
    } else {
      this.classList.add('flipped');
    }
  }

  discard(side) {
    this.addEventListener('animationend', e => this.remove(), { once: true });
    this.classList.add(`discard-${side}`);
  }
}

export class App extends HTMLElement {
  connectedCallback() {
    this.$deck = this.querySelector('deck');

    this.querySelector('#next').addEventListener('click', this.next.bind(this));
    this.querySelector('#back').addEventListener('click', this.back.bind(this));

    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        this.next();
      }

      if (event.key === 'ArrowLeft') {
        this.back();
      }

      if (event.key === ' ') {
        event.preventDefault();
        this.$card.flip();
      }
    });

    window.addEventListener('touchstart', (touchStartEvent) => {
      window.addEventListener('touchend', (touchEndEvent) => {
        const diffX = touchEndEvent.changedTouches[0].screenX - touchStartEvent.changedTouches[0].screenX;
        const diffY = touchEndEvent.changedTouches[0].screenY - touchStartEvent.changedTouches[0].screenY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            this.next();
          } else {
            this.back();
          }
        }
      }, { once: true });
    });

    this.dictionary = data.toShuffled();
    this.currentIdx = -1;

    this.next();
  }

  createCardElement(item) {
    const card = document.createElement('riddle-card');
    card.setAttribute('side-a', item[1]);
    card.setAttribute('side-b', item[0]);
    return card;
  }

  next() {
    if (this.dictionary.length > this.currentIdx + 1) {
      this.$card?.discard('to-left');
      this.$card = this.createCardElement(this.dictionary[++this.currentIdx]);
      this.$card.classList.add('play-from-right');
      this.$deck.append(this.$card);
    }
  }

  back() {
    if (this.currentIdx > 0) {
      this.$card?.discard('to-right');
      this.$card = this.createCardElement(this.dictionary[--this.currentIdx]);
      this.$card.classList.add('play-from-left');
      this.$deck.append(this.$card);
    }
  }
}
