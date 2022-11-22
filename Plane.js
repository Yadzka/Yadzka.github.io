// Var menyimpan data sementara
var player;
var myObstacles = [];
var myBackground;
var myScore;
var myMusic;

const up = 87;
const left = 65;
const down = 83;
const right = 68;

// addeventlistener untuk bisa mengendalikan karakter
window.addEventListener("keydown", move);
window.addEventListener("keyup", stopMove);

// Membuat fungsi dari bagian player, score, musik, dan background(Latar Belakang)
function startGame() {
  player = new component(125, 70, "Gambar/Pesawat.png", 10, 190, "image");
  myScore = new component("30px", "Arial", "red", 520, 40, "text");
  myMusic = new sound("Music.mp3")
  myBackground = new component(
    1200,
    600,
    "Gambar/MD.png",
    0,
    0,
    "background"
  );
  myMusic.play();
  myGameArea.start();
}
// Membuat Area pada Game
var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 1200;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");

    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener("keydown", function (e) {
      myGameArea.key = e.keyCode;
    });
    window.addEventListener("keyup", function (e) {
      myGameArea.key = e.keyCode;
    });
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
  },
};

// fungsi pada komponen
function component(width, height, color, x, y, type) {
  this.type = type;
  if (type == "image" || type == "background") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.toX = 0;
  this.toY = 0;
  this.x = x;
  this.y = y;
  this.update = function () {
    ctx = myGameArea.context;

    if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    }

    if (type == "image" || type == "background") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      if (type == "background") {
        ctx.drawImage(
          this.image,
          this.x + this.width - 6,
          this.y,
          this.width,
          this.height
        );
      }
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  this.movement = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    this.hitTop();
    this.hitBottom();
    this.hitRight();
    this.hitLeft();
  };
  this.movementBack = function () {
    this.x += this.toX;
    this.y += this.toY;
    if (this.type == "background") {
      if (this.x == -this.width) {
        this.x = 0;
      }
    }
  };
  // fungsi charkarter saat menabrak
  this.crashWith = function (otherobj) {
    var myleft = this.x;
    var myright = this.x + this.width;
    var mytop = this.y;
    var mybottom = this.y + this.height;
    var otherleft = otherobj.x;
    var otherright = otherobj.x + otherobj.width;
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + otherobj.height;
    var crash = true;
    if (
      mybottom < othertop ||
      mytop > otherbottom ||
      myright < otherleft ||
      myleft > otherright
    ) {
      crash = false;
    }
    return crash;
  };

  // fungsi hit untuk memberi batasan agar karakter dan obstcales tidak melewati batas canvas
  this.hitTop = function () {
    let objTop = this.height - this.height;
    if (this.y < objTop) {
      this.y = objTop;
    }
  };

  this.hitBottom = function () {
    let objBottom = 600 - this.height;
    if (this.y > objBottom) {
      this.y = objBottom;
    }
  };

  this.hitLeft = function () {
    let objLeft = 1200 - this.width;
    if (this.x > objLeft) this.x = objLeft;
  };

  this.hitRight = function () {
    let objRight = this.width - this.width;
    if (this.x < objRight) {
      this.x = objRight;
    }
  };
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}

// Fungsi Suara
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
      this.sound.play();
  }
  this.stop = function(){
      this.sound.pause();
  }    
}

// Memperbaharui suatu bagian game
function updateGameArea() {
  var x,
    minHeight,
    maxHeight,
    height,
    minGap,
    maxGap,
    gap1,
    minHeight1,
    maxHeight1,
    height1,
    minGap1,
    maxGap1,
    gap;
  for (i = 0; i < myObstacles.length; i += 1) {
    if (player.crashWith(myObstacles[i])) {
      myGameArea.stop();
      myMusic.stop();
      return;
    }
  }
  myGameArea.clear();
  // Membuat Obstacle dan membuat obstacle jadi random dan banyak
  myGameArea.frameNo += 1;
  if (myGameArea.frameNo == 1 || everyinterval(50)) {
    x = myGameArea.canvas.width;
    minHeight = 0;
    maxHeight = 260;
    height = Math.floor(
      Math.random() * (maxHeight - minHeight + 1) + minHeight
    );
    minGap = 300;
    maxGap = 560;
    gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    minHeight1 = 200;
    maxHeight1 = 900;
    height1 = Math.floor(
      Math.random() * (maxHeight1 - minHeight1 + 1) + minHeight1
    );
    minGap1 = 300;
    maxGap1 = 700;
    gap1 = Math.floor(Math.random() * (maxGap1 - minGap1 + 1) + minGap1);
    myObstacles.push(
      new component(90, 75, "Gambar/Burung.png", x + gap1, height, "image")
    );
    myObstacles.push(
      new component(90, 75, "Gambar/Burung.png", x + height1, gap, "image")
    );
  }
  // myBackground.movementBack();
  myBackground.update();
  myBackground.toX = -2;
  for (i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x += -10;
    myObstacles[i].update();
  }

  myScore.text = "SCORE: " + myGameArea.frameNo;
  myScore.update();
  player.movement();
  player.update();
}

// Fungsi buat menggerakkan character
function move(event) {
  const keyPressed = event.keyCode;
  if (keyPressed == left) {
    player.speedX = -5;
  } else if (keyPressed == right) {
    player.speedX = 5;
  } else if (keyPressed == up) {
    player.speedY = -5;
  } else if (keyPressed == down) {
    player.speedY = 5;
  }
}


// Fungsi buat menggerakkan character
function stopMove(event) {
  const keyPressed = event.keyCode;
  if (keyPressed == left) {
    player.speedX = 0;
  } else if (keyPressed == right) {
    player.speedX = 0;
  } else if (keyPressed == up) {
    player.speedY = 0;
  } else if (keyPressed == down) {
    player.speedY = 0;
  }
}
