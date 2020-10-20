import {ctx, w, h, b, hh, bw} from './game.mjs';

class Player {
  constructor({x, y, score, id}) {
    this.x = x; // Math.floor(Math.random() * 620) + 110;
    this.y = y; // Math.floor(Math.random() * 360) + 110;
    this.score = score;
    this.id = id; // Math.random().toString(36).substr(2, 9);
    this.color = this.generateColor();
  }

  movePlayer(dir, speed) {
    switch (dir) {
      case "left":
        this.x = Math.max(this.x - speed, b);
        break;
      case "right":
        this.x = Math.min(this.x + speed, w-b-28);
        break;
      case "up":
        this.y = Math.max(this.y - speed, hh + 28);
        break;
      case "down":
        this.y = Math.min(this.y + speed, h-b);
        break;
    }
  }

    collision(item) {
        let { x, y, value, id } = item;
        let r = 7;      // radius of collectible
        let p = 28;     // width/height of player icon

        if (x+r > this.x && x-r < this.x+p && y-r < this.y && y+r > this.y-p) {
            this.score += value;
            return true;
        } else {
            return false;
        }
    }

  calculateRank(arr) {

    // arr = [{'id': 123, 'score': 3}, {'id': 456, 'score': 5}];

    arr.sort((a, b) => {
        return ((b.score < a.score) ? -1 : ((b.score > a.score) ? 1 : 0));
    });

    let rank = arr.findIndex(p => p.id == this.id)+1;
    return `Rank: ${rank} / ${arr.length}`;

  }

  generateColor() {
    let e = "#";
    for (let t = "0123456789ABCDEF", i = 0; i < 6; i++) {
        e += t[Math.ceil(15 * Math.random())];
    }
    return e
  }

}

try {
    module.exports = Player;
  } catch(e) {}

export default Player;


