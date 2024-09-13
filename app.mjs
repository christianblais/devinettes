/**
       * @returns A new randomized array
       */
Array.prototype.toShuffled = function() {
  const array = [...this];

  for (let i = array.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [array[i], array[rand]] = [array[rand], array[i]];
  }

  return array;
}

window.dictionary = [
  [`Amqui`, `Radio autre que FM, pronom relatif`],
  [`Argenteuil`, `Dollar, Yeux`],
  [`Arvida`, `Elle enleva le contenu une deuxième fois`],
  [`Beaupré`, `Joli champs`],
  [`Beaconsfield`, `Champs anglophone de jambon`],
  [`Bécancour`, `Bouche d'oiseau, douze mois, marche vite`],
  [`Bellechasse`, `Jolie poursuite`],
  [`Belleterre`, `Jolie planète`],
  [`Beloeil`, `Joli globe oculaire`],
  [`Boisbriand`, `Forêt lumineuse`],
  [`Bonaventure`, `Agréable péripétie`],
  [`Boucherville`, `Agglomération des débiteurs de viande`],
  [`Bromont`, `Dude, Colline`],
  [`Cap-Chat`, `Péninsule qui n'est pas un chien`],
  [`Cap-Santé`, `Péninsule qui n'est pas malade`],
  [`Charlemagne`, `Roi des francs`],
  [`Châteauguay`, `Palais heureux`],
  [`Chicoutimi`, `Défèque, frappe, petit en language familier, note musicale`],
  [`Coaticook`, `Raton d'amérique centrale qui cuisine en anglais`],
  [`Contrecoeur`, `À l'envers d'un organe`],
  [`Contrecoeur`, `Malgré soi`],
  [`Deux-Montagnes`, `Moins que trois grosses collines`],
  [`Dorval`, `Fait dodo, vallée`],
  [`Drummondville`, `Instrument de percussion sur la cité`],
  [`Escoumins`, `Pluriel, tient la tête, au bout des bras`],
  [`Etchemins`, `(Les) Liaison, sentiers`],
  [`Fermont`, `Montagne de métaux magnétique`],
  [`Forestville`, `Agglomération dans le bois anglophone`],
  [`Grosse-Île`, `Corpulent atoll`],
  [`Havre-Saint-Pierre`, `Port de l'apôtre`],
  [`Issoudun`, `Il lie métaliquement un [...]`],
  [`Joliette`, `Petite beauté`],
  [`Jonquière`, `Anneau, pronom relatif, avant aujourd'hui`],
  [`Kamouraska`, `Qu'un sentiment à danse jamaïcaine`],
  [`L'Ancienne-Lorette`, `Très vieille lorette`],
  [`Lac-Sergent`, `Étendue d'eau militaire`],
  [`Lachine`, `L'Empire du Milieu`],
  [`Lachute`, `La débâcle`],
  [`La Tuque`, `Le chapeau qui tient au chaud`],
  [`Longueuil`, `Globe oculaire étiré`],
  [`Malartic`, `Douloureux pôle`],
  [`(La) Malbaie`, `Douleur, petit fruit`],
  [`Matapédia`, `À moi, à toi, à la fin de wiki`],
  [`Matane`, `À moi, à toi, négation`],
  [`Métis-sur-Mer`, `Autochtone à l'océan`],
  [`Mingan`, `Une partie du corps et son vêtement`],
  [`Mirabel`, `Au centre du pain, plus gros qu'une souris, joli`],
  [`Montmagny`, `Colline, à moi, Gross National Income`],
  [`Mont-Royal`, `Colline de sa majesté`],
  [`Mont-Tremblant`, `Colline qui frissonne`],
  [`Murdochville`, `Parois, Docteur, Municipalité`],
  [`Neuville`, `Municipalité récente`],
  [`Notre-Dame-des-Prairies`, `Vierge des champs`],
  [`Notre-Dame-du-Portage`, `Vierge du transport`],
  [`Percé`, `Troué`],
  [`Pincourt`, `Conifère pas très grand`],
  [`Pont-Rouge`, `Gros viaduc couleur sang`],
  [`Portneuf`, `Cochon récent`],
  [`Prévost`, `Champs, jeune vache`],
  [`Québec`, `Plate-forme marine, bisou`],
  [`Richelieu`, `Emplacement pas pauvre du tout`],
  [`Rimouski`, `S'esclaffe, pas dur, sport de neige`],
  [`Rivière-du-Loup`, `Cours d'eau appartenant au canin`],
  [`Rouyn`, `Pneu, quoi!?`],
  [`Saint-Hilarion`, `Rieur béni chargé positivement ou négativement`],
  [`Saint-Paul-de-l'Île-aux-Noix`, `Apôtre de l'atoll aux arachides`],
  [`Sept-Île`, `Est-ce qu'il connaît?`],
  [`Shawinigan`, `Félin, positif, négation, tient la main au chaud`],
  [`Sherbrooke`, `Dispendieux, ruisseau anglophone`],
  [`Tadoussac`, `Pile soyeuse emballée`],
  [`Trois-Rivière`, `Moins de quatre cours d'eau`],
  [`Verchères`, `Gobelet dispendieux`],
  [`Yamachiche`, `Il détient une chiche qui m'appartient`],
  [`Yamaska`, `Il détient mon style musical d'origine Jamaïquaine`],
];

export class RiddleCard extends HTMLElement {
  constructor() {
    super();

    this.$template = document.querySelector('#card-template').content;
  }

  connectedCallback() {
    this.addEventListener('click', this.flip);

    const content = this.$template.cloneNode(true);

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
    this.addEventListener('animationend', (e) => this.remove(), { once: true });
    this.classList.add(`discard-${side}`);
  }
}

export class RiddleApp extends HTMLElement {
  constructor() {
    super();

    this.dictionary = window.dictionary.toShuffled();
    this.currentIdx = 0;
  }

  connectedCallback() {
    this.$deck = this.querySelector('deck');

    this.querySelector('#next').addEventListener('click', this.next.bind(this));
    this.querySelector('#back').addEventListener('click', this.back.bind(this));

    window.addEventListener('keydown', (event) => {
      // right arrow
      if (event.keyCode === 39) {
        this.next();
      }

      // left arrow
      if (event.keyCode === 37) {
        this.back();
      }

      // spacebar
      if (event.keyCode === 32) {
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

    // Start the game by initializing a first item
    this.play('play-from-right');
  }

  play(htmlClasses = []) {
    this.$card = document.createElement('riddle-card');
    this.$card.setAttribute('side-a', this.dictionary[this.currentIdx][1]);
    this.$card.setAttribute('side-b', this.dictionary[this.currentIdx][0]);
    this.$card.classList.add(htmlClasses);
    this.$deck.append(this.$card);
  }

  next() {
    if (this.dictionary.length > this.currentIdx + 1) {
      this.$card.discard('to-left');
      this.currentIdx++;
      this.play('play-from-right');
    }
  }

  back() {
    if (this.currentIdx > 0) {
      this.$card.discard('to-right');
      this.currentIdx--;
      this.play('play-from-left');
    }
  }
}
