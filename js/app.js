function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

class Entity {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

class Enemy extends Entity {
  constructor(x, y) {
    // Inherit parent properties
    super(x, y);

    this.speed = randomNumber(120, 200);
    this.sprite = 'images/enemy-bug.png';
  }

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    this.x = this.x + this.speed * dt;

    if (this.x >= 505) {
      this.x = 0;
    }

    this.checkCollision();
  }

  checkCollision() {
    if (player.y + 131 >= this.y + 90 &&
        player.y + 73 <= this.y + 135 &&
        player.x + 25 <= this.x + 88 &&
        player.x + 76 >= this.x + 11)
    {
      gameReset();
    }
  }
}

class Player extends Entity {
  constructor(x, y) {
    // Inherit parent properties
    super(x, y);

    this.sprite = 'images/char-boy.png'
  }

  update() {}

  handleInput(key) {
    if (key == 'left' && this.x > 100) {
      this.x -= 100;
    }

    else if (key == 'right' && this.x < 400) {
      this.x += 100
    }

    else if (key == 'down' && this.y < 350){
      this.y += 80
    }

    else if (key == 'up') {
      this.y -= 80;

      if (this.y <= (83 - 48)) {
        gameOver();
      }
    }
  }

  reset() {
    this.x = 202.5;
    this.y = 383;
  }
}

var allEnemies = [];
var player = new Player(0, 0, 50);
var scoreDiv = document.createElement('div');
var canvasDiv = document.getElementsByTagName('canvas')[0];

gameReset();

document.body.insertBefore(scoreDiv, canvasDiv);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});

var score = 0;

function randomSprite() {
  const sprites = [
      'images/char-boy.png',
      'images/char-cat-girl.png',
      'images/char-horn-girl.png',
      'images/char-pink-girl.png',
      'images/char-princess-girl.png'
  ];

  return sprites[Math.floor(Math.random() * sprites.length)];
}

function gameReset() {
  player.reset();
  player.sprite = randomSprite();

  score = 0;
  updateScore();

  allEnemies = [];
  allEnemies.push(new Enemy(0, Math.random() * 150 + 50));
}

function gameOver() {
  player.reset();

  score += 1;
  updateScore();

  // Custom logic for enemy spawn and score, if score is even
  // and there are less than 4 enemies in screen, then,
  // spawn one more enemy
  if (score % 2 == 0 && allEnemies.length < 4) {
    allEnemies.push(new Enemy(0, Math.random() * 160 + 50));
  }
}

function updateScore() {
  scoreDiv.innerHTML = 'Score ' + score;
}
