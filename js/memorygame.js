import Card from './card.js';

const play = document.querySelector('.play');
const overFlow = document.querySelector('.overflow');
const backMenu = document.querySelector('.backMenu');
let intervalID;

export default class MemoryGame {
  constructor(numberOfCards = 10, name = 'Bezimienny') {
    this.images = [
      'images/crocodile.png',
      'images/monkey.png',
      'images/shark.png',
      'images/snake.png',
      'images/tiger.png',
      'images/owl.png',
      'images/turtle.png',
      'images/ostrich.png',
      'images/chicken.png',
      'images/elephant.png',
      'images/mouse.png',
      'images/giraffe.png',
      'images/bear.png',
    ]; // 26 images
    // https://www.flaticon.com/authors/smalllikeart icons created by smalllikeart - Flaticon
    this.imageFrontCard = 'images/question-mark.png';
    // https://www.flaticon.com/free-icons/question-mark Question mark icons created by Freepik - Flaticon

    this.numberOfCards = numberOfCards;
    this.playCards = [];
    this.blockCardBoard = false;
    this.flipCard = [];
    this.flipCardTime = 500;
    this.tryMatchNumber = 0;
    this.timer = 0;
    this.localStorageScore = (localStorage.getItem('scores') ? [...JSON.parse(localStorage.getItem('scores'))] : []);
    this.name = name;
  }

  createCards() {
    for (let i = 0; i < (this.numberOfCards / 2); i += 1) {
      for (let y = 0; y < 2; y += 1) {
        const card = new Card(this.images[i], i);
        this.playCards.push(card);
      }
    }

    this.renderBoard();

    const frontCardImg = [...document.querySelectorAll('.frontCard img')];
    const backCardImg = [...document.querySelectorAll('.backCard img')];
    const cards = [...document.querySelectorAll('.card')];
    this.randomCards();
    for (let i = 0; i < this.numberOfCards; i += 1) {
      backCardImg[i].src = this.playCards[i].image;
      frontCardImg[i].src = this.imageFrontCard;
      cards[i].dataset.id = this.playCards[i].id;
    }
  }

  renderBoard() {
    const ul = document.querySelector('.cards');
    ul.innerHTML = '';
    for (let i = 0; i < this.numberOfCards; i += 1) {
      const li = document.createElement('li');
      li.className = 'card';
      const divFront = document.createElement('div');
      divFront.classList.add('frontCard');
      const divBack = document.createElement('div');
      divBack.classList.add('backCard');
      const img = document.createElement('img');
      const img2 = document.createElement('img');
      li.appendChild(divFront);
      li.appendChild(divBack);
      divFront.appendChild(img);
      divBack.appendChild(img2);
      li.addEventListener('click', () => {
        this.gameFlipCard(li);
      });
      ul.appendChild(li);
    }
  }

  setTimer(option = 0) {
    if (option === 1) {
      const saveData = (new Date()).getTime();
      const timerStrong = document.querySelector('.timer strong');
      intervalID = setInterval(() => {
        this.timer = (((new Date().getTime()) - saveData) / 1000).toFixed();
        timerStrong.textContent = this.timer;
      }, 1000);
    } else {
      clearInterval(intervalID);
    }
  }

  gameStart() {
    play.style.display = 'none';
    backMenu.style.display = 'none';
    overFlow.style.display = 'none';
    document.querySelector('.menu').style.display = 'none';
    document.querySelector('.game').style.display = 'block';
    this.tryMatchNumber = 0;
    this.createCards();
    document.querySelector('.tryNumber strong').textContent = '0';
    this.setTimer(1);
    document.querySelector('.timer strong').textContent = '0';
  }

  gameFlipCard(card) {
    if (!card.classList.contains('checked')) {
      if (this.flipCard.length !== 2 && !this.blockCardBoard && this.flipCard[0] !== card) {
        this.flipCard.push(card);
        card.classList.toggle('active');
      }
      if (this.flipCard.length === 2 && !this.blockCardBoard) {
        this.blockCardBoard = true;
        this.checkCard();
      }
    }
  }

  checkCard() {
    const tryMatchNumberStrong = document.querySelector('.tryNumber strong');
    this.tryMatchNumber += 1;
    tryMatchNumberStrong.textContent = this.tryMatchNumber;

    if (this.flipCard[0].dataset.id === this.flipCard[1].dataset.id) {
      this.playCards.splice(this.playCards.findIndex(
        (e) => e.id === Number(this.flipCard[0].dataset.id),
      ), 1);
      this.playCards.splice(this.playCards.findIndex(
        (e) => e.id === Number(this.flipCard[0].dataset.id),
      ), 1);
      this.flipCard[0].classList.add('checked');
      this.flipCard[1].classList.add('checked');
      this.flipCard = [];
      this.blockCardBoard = false;

      if (this.playCards.length === 0) {
        setTimeout(() => {
          this.endOfGame();
        }, this.flipCardTime);
      }
    } else {
      const flipCard1 = this.flipCard[0];
      const flipCard2 = this.flipCard[1];

      setTimeout(() => {
        this.flipCard = [];
        this.blockCardBoard = false;
        flipCard1.classList.toggle('active');
        flipCard2.classList.toggle('active');
      }, this.flipCardTime);
    }
  }

  randomCards() {
    for (let i = this.playCards.length - 1; i > 0; i -= 1) {
      const swap = Math.floor(Math.random() * i);
      const tmp = this.playCards[i];
      this.playCards[i] = this.playCards[swap];
      this.playCards[swap] = tmp;
    }
  }

  endOfGame() {
    this.setTimer(0);
    play.style.display = 'block';
    overFlow.style.display = 'flex';
    const yourScore = document.querySelector('.yourScore');
    backMenu.style.display = 'block';
    yourScore.textContent = `Your Score: ${this.points()}`;
    this.saveToLocalStorageScore();
  }

  points() {
    return (2000 - (this.timer * 3) - (this.tryMatchNumber * 10))
      ? (2000 - (this.timer * 3) - (this.tryMatchNumber * 10) + (this.numberOfCards * 30)) : 0;
  }

  saveToLocalStorageScore() {
    const score = {
      tryNumber: this.tryMatchNumber,
      time: Number(this.timer),
      name: this.name,
      points: this.points(),
    };
    this.localStorageScore.push(score);
    localStorage.setItem('scores', JSON.stringify(this.localStorageScore));
  }
}
