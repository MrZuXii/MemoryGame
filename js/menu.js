import MemoryGame from './memorygame.js';

class Menu {
  constructor() {
    this.name = (localStorage.getItem('name') ? localStorage.getItem('name') : 'Anonymous');
    this.numberOfCards = (localStorage.getItem('numberofcards') ? localStorage.getItem('numberofcards') : 10);
  }

  play() {
    const game = new MemoryGame(this.numberOfCards, this.name);
    game.gameStart();
  }

  scoreTable() {
    const localStorageScore = (localStorage.getItem('scores') ? [...JSON.parse(localStorage.getItem('scores'))] : []);
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    const tdRank = document.createElement('td');
    const tdScore = document.createElement('td');
    const scoreTable = document.querySelector('.scoreTable');

    document.querySelector('.score').style.display = 'flex';
    document.querySelector('.mainMenu').style.display = 'none';

    scoreTable.innerHTML = '';
    tdRank.textContent = '#';
    tdName.textContent = 'Name';
    tdScore.textContent = 'Score';
    tr.append(tdRank, tdName, tdScore);
    tbody.appendChild(tr);

    const sortByRank = localStorageScore.sort((a, b) => {
      if (a.points < b.points) return 1;
      if (a.points > b.points) return -1;
      return 0;
    });

    for (const [index, item] of sortByRank.entries()) {
      const NewTr = document.createElement('tr');
      const NewTrName = document.createElement('td');
      const NewTdRank = document.createElement('td');
      const NewTdScore = document.createElement('td');
      NewTrName.textContent = item.name;
      NewTdScore.textContent = item.points;
      NewTdRank.textContent = String(index + 1);
      NewTr.append(NewTdRank, NewTrName, NewTdScore);
      tbody.appendChild(NewTr);
    }

    table.appendChild(tbody);
    scoreTable.append(table);
  }

  resetScoreTable() {
    localStorage.setItem('scores', '');
  }

  options() {
    document.querySelector('.mainMenu').style.display = 'none';
    document.querySelector('.score').style.display = 'none';
    document.querySelector('.options').style.display = 'flex';
    const numberOfCardsInput = document.querySelector('.numberOfCardsInput');
    const nameInput = document.querySelector('.name');
    const label = document.querySelector('.actualValueOfCards');
    label.textContent = this.numberOfCards;
    numberOfCardsInput.value = (this.numberOfCards / 2);
    nameInput.value = this.name;
    nameInput.addEventListener('input', (e) => {
      this.name = e.target.value;
      localStorage.setItem('name', this.name);
    });
    numberOfCardsInput.addEventListener('input', (e) => {
      this.numberOfCards = Number(e.target.value) * 2;
      label.textContent = this.numberOfCards;
      localStorage.setItem('numberofcards', this.numberOfCards);
    });
  }

  menu() {
    document.querySelector('.options').style.display = 'none';
    document.querySelector('.score').style.display = 'none';
    document.querySelector('.game').style.display = 'none';
    document.querySelector('.mainMenu').style.display = 'flex';
    document.querySelector('.menu').style.display = 'block';
  }

  render() {
    document.querySelector('.btn-play').addEventListener('click', () => this.play());
    document.querySelector('.btn-score-table').addEventListener('click', () => this.scoreTable());
    document.querySelector('.btn-options').addEventListener('click', () => this.options());
    document.querySelectorAll('.back')[0].addEventListener('click', () => this.menu());
    document.querySelectorAll('.back')[1].addEventListener('click', () => this.menu());
    document.querySelector('.play').addEventListener('click', () => this.play());
    document.querySelector('.backMenu').addEventListener('click', () => this.menu());
    document.querySelector('.resetScoreTable').addEventListener('click', () => this.resetScoreTable());
  }
}

const menu = new Menu();
menu.render();
