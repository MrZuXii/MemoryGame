import { MemoryGame } from './memorygame.js';

class Menu {
  constructor() {
    this.name = (localStorage.getItem('name') ? localStorage.getItem('name') : 'Bezimienny');
    this.numberOfCards = (localStorage.getItem('numberofcards') ? localStorage.getItem('numberofcards') : 10);
  }

  play() {
    const game = new MemoryGame(this.numberOfCards, this.name);
    game.gameStart();
  }

  options() {
    this.renderMenu(1);
  }

  scoreTable() {
    const menu = document.querySelector('.menu');
    const h1 = document.createElement('h1');
    h1.textContent = 'Memory Game';
    menu.innerHTML = '';
    const btnBack = document.createElement('button');
    btnBack.textContent = 'Wróć';
    btnBack.addEventListener('click', () => this.renderMenu());
    menu.appendChild(h1);
    const localStorageScore = (localStorage.getItem('scores') ? [...JSON.parse(localStorage.getItem('scores'))] : []);
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    const tdRank = document.createElement('td');
    tdRank.textContent = '#';
    const divContainer = document.createElement('div');
    divContainer.style.overflow = 'auto';
    divContainer.style.width = '80%';
    tdName.textContent = 'Imię';
    const tdScore = document.createElement('td');
    tdScore.textContent = 'Wynik';
    tr.append(tdRank, tdName, tdScore);
    tbody.appendChild(tr);
    const sortByRank = localStorageScore.sort((a, b) => {
      if (a.points < b.points) return 1;
      if (a.points > b.points) return -1;
      return 0;
    });
    for (const [index, item] of sortByRank.entries()) {
      const tr = document.createElement('tr');
      const trName = document.createElement('td');
      const tdRank = document.createElement('td');
      const tdScore = document.createElement('td');

      trName.textContent = item.name;
      tdScore.textContent = item.points;
      tdRank.textContent = index + 1;
      tr.append(tdRank, trName, tdScore);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    divContainer.appendChild(table);
    menu.append(divContainer, btnBack);
  }

  renderMenu(key) {
    const menu = document.querySelector('.menu');
    const h1 = document.createElement('h1');
    h1.textContent = 'Memory Game';
    menu.innerHTML = '';
    const btnBack = document.createElement('button');
    btnBack.textContent = 'Wróć';
    btnBack.addEventListener('click', () => this.renderMenu());

    const btnPlay = document.createElement('button');
    const cardBoard = document.querySelector('.cardBoard');
    const btnScoreTable = document.createElement('button');
    const btnOptions = document.createElement('button');
    const footer = document.createElement('footer');

    const inputRange = document.createElement('input');
    const inputText = document.createElement('input');
    const label = document.createElement('label');
    const div = document.createElement('div');

    switch (key) {
      case 1:
        menu.appendChild(h1);

        inputText.value = this.name;
        inputText.type = 'text';
        inputText.classList = 'name';
        inputRange.min = 1;
        inputRange.max = 13;
        inputRange.type = 'range';
        label.textContent = this.numberOfCards;
        inputRange.value = (this.numberOfCards / 2);
        inputRange.addEventListener('input', (e) => {
          this.numberOfCards = Number(e.target.value) * 2;
          label.textContent = this.numberOfCards;
          localStorage.setItem('numberofcards', this.numberOfCards);
        });
        inputText.addEventListener('input', (e) => {
          this.name = e.target.value;
          localStorage.setItem('name', this.name);
        });
        div.append(inputRange, label);
        menu.append(div, inputText, btnBack);
        break;

      default:

        cardBoard.style.display = 'none';

        btnOptions.textContent = 'Opcje';
        btnOptions.classList = 'btn-options';
        btnOptions.addEventListener('click', () => this.options());

        btnPlay.textContent = 'graj';
        btnPlay.classList = 'btn-play';
        btnPlay.addEventListener('click', () => this.play());

        btnScoreTable.textContent = 'Tablica Wyników';
        btnScoreTable.classList = 'btn-score-table';
        btnScoreTable.addEventListener('click', () => this.scoreTable());

        footer.textContent = '© MemoryGame By Kamil Bieniek';

        menu.style.display = 'flex';
        menu.append(h1, btnPlay, btnScoreTable, btnOptions, footer);

        break;
    }
  }
}

const menu = new Menu();
menu.renderMenu();

const play = document.querySelector('.play');
const backMenu = document.querySelector('.backMenu');

play.addEventListener('click', () => {
  menu.play();
});
backMenu.addEventListener('click', () => {
  menu.renderMenu();
});
