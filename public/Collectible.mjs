import {ctx, w, h, b, hh} from './game.mjs';

class Collectible {
    constructor({x, y, value, id}) {
      this.x = x;
      this.y = y;
      this.value = value;
      this.id = id;
      this.color = (this.value==1) ? 'darkgoldenrod' : (this.value == 2) ? 'silver' : 'gold';
    }

  }

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;


