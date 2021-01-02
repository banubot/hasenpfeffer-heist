export default function Player(number, name, favVeg, rabbitImg) {
  this.name = name;
  this.num = number;
  this.rabbitImg = rabbitImg;
  this.favVeg = favVeg;
  this.actions = [];
  this.paws = [];
  this.stash = [];
};

// export const vegetable = {
//   "points": 0,
//   "name": "",
//   "vegImg": ""
// }

// //maybe dont need
// export const actionTypes = ["garden", "stash", "steal", "block", "endTurn"];

// export const allVeg = [
//   {

//   }
// ]
