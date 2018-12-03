/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Board.js":
/*!**********************!*\
  !*** ./src/Board.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

class Board {
  constructor(size){
      this.size = size;
      this.map = new Array(size);
      for( let i = 0; i < size; i++ ){
          this.map[i] = new Array(size);
      }
  }
}

module.exports = Board;

/***/ }),

/***/ "./src/Card.js":
/*!*********************!*\
  !*** ./src/Card.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

class Card{
  constructor(id, img, element, clickCallback){
      this.id=id;
      this.img=img;
      this.side=false;
      this.element=element;
      this.clickCallback = clickCallback;
      //  set img for front background
      this.element.children[0].children[1].style.backgroundImage = `url(${this.img})`;
      
      // add listener for click
      this.listener = (event) => {
          this.clickCallback(event);
          this.flip();
      }
      this.element.addEventListener('click',this.listener);
  
  }
  onFound(){
      this.element.removeEventListener('click',this.listener);
  }
 
  flip(){
      this.side=!this.side;
      if(this.side){
          this.element.children[0].style.transform = 'rotateY(180deg)';
      }
      else{
          this.element.children[0].style.transform = 'rotateY(0deg)';   
      }
  } 
}


module.exports=Card



/***/ }),

/***/ "./src/Game.js":
/*!*********************!*\
  !*** ./src/Game.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Board = __webpack_require__(/*! ./Board */ "./src/Board.js");
const Card = __webpack_require__(/*! ./Card */ "./src/Card.js");

class Game {
    constructor(element,restart){
        this.element = element;
        this.cards = [];
        this.onClick = this.onClick.bind(this);
        this.firstCard = null;
        this.restart = restart;
        this.restart.addEventListener('click',()=> this.init(8))
        this.timerId = null;
        this.second = 0;
        this.minute = 0;      
        this.hour = 0;
        this.numberOfCards = 0;
        this.bestResult = localStorage.getItem('result') ? localStorage.getItem('result') : 10000;
        if(this.bestResult == '10000'){
            document.querySelector('.bestResult').innerHTML = 'first game';
        }
        else{
            document.querySelector('.bestResult').innerHTML = this.bestResult;
        }
        this.step = 0;
        this.time = 0;
    
      }
    
    // disable click while waiting for timeout
    handleClick(event){
        event.stopPropagation();
    }
    onClick(event){
        const cardElement = event.currentTarget;
        if( this.firstCard === null ){
            for( let card of this.cards ){
                if(card.element === cardElement ){
                    return this.firstCard = card;
                }
            }
            
        }
        if(this.firstCard !== null){
            for( let card of this.cards ){
                if(card.element === cardElement ){
                    if(card.id === this.firstCard.id){
                        card.onFound()
                        this.firstCard.onFound();
                        this.firstCard = null;
                        this.calcWin();
                        return;
                    }
                    else{
                        this.element.addEventListener('click',this.handleClick,true);
                        setTimeout(()=>{
                            
                            card.flip()
                            this.firstCard.flip();
                            this.firstCard = null;
                            console.log(this.element)
                            this.element.removeEventListener('click',this.handleClick,true);
                        },2000);
                        return;
                    
                    }
                }
            }
        }     
    }
    init(boardSize){
        this.numberOfCards = boardSize;
        this.step = 0;
        this.element.innerHTML = '';
        this.cards = [];
        // fetch cards
        fetch('http://localhost:3000/cards')
        .then( data => data.json() )
        .then( json => {
            json=json.slice(0,boardSize);
            console.log(json);
            for( let cardJson of json.concat(json) ){
                const newCardEl = getCardElement();
                
                const card = new Card(cardJson.id,cardJson.img,newCardEl, this.onClick );
                this.cards.push(card);
            }
            this.shuffleCards();
            //  append to dom
            for( let card of this.cards){
                this.element.appendChild(card.element);
            }
            if(this.timerId){
              clearInterval(this.timerId)
              this.second = 0;
              this.minute = 0;
              this.hour = 0;
              this.timerId = setInterval(()=>this.timer(),1000);
          }
          else{
              this.timerId = setInterval(()=>this.timer(),1000);
          }

            console.log('cards',this.cards)
        })
        .catch( err => console.log(err))
    }

    shuffleCards(){
      for( let i = 0; i<200; i++ ){
          var num1 = Math.floor(Math.random() * this.cards.length);
          var num2 = Math.floor(Math.random() * this.cards.length);
          const temp = this.cards[num1];
          this.cards[num1] = this.cards[num2];
          this.cards[num2] = temp;
      }   
  }
    timer(){
      const secondStr=(this.second < 10) ? '0' + this.second.toString() : this.second.toString();   
      const minutesStr=(this.minute<10)?'0'+this.minute.toString():this.minute.toString();   
      const hoursStr=(this.hour<10)?'0'+this.hour.toString():this.hour.toString();   
      document.querySelector(".demo").innerHTML =hoursStr+":"+minutesStr+":"+secondStr;
      if (this.second<59){
          this.second++;   
      }    
      else{       
          this.second=0;       
          this.minute++;   
      }    
      if (this.minute>59){       
          this.minute=0;       
          this.hour++;    
      } 
  }
  calcWin(){
    this.step++;
    if(this.step === this.numberOfCards ){
        const result = this.minute*60 + this.second;
        this.bestResult = parseInt(this.bestResult) < result ? this.bestResult : result;
        localStorage.setItem('result',  JSON.stringify(this.bestResult) );
        clearInterval(this.timerId);
        document.querySelector('.bestResult').innerHTML = this.bestResult;
       
    }
    
}
}


function getCardElement(){
    const cardContainer=document.createElement('div');
    cardContainer.className = 'card';

    cardContainer.innerHTML= `
        <div class="card-inner">
            <div class="card-back"></div>
            <div class="card-front"></div>
        </div>
    `;
    return cardContainer;
}






module.exports = Game;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Card = __webpack_require__(/*! ./Card */ "./src/Card.js");
const Board = __webpack_require__(/*! ./Board */ "./src/Board.js");
const Game = __webpack_require__(/*! ./Game */ "./src/Game.js");

const gameElement = document.querySelector('.game');
console.log(gameElement);
const restartBtn = document.querySelector('.restart');
const game = new Game(gameElement,restartBtn);
game.init(8); 
game.timer();






/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0JvYXJkLmpzIiwid2VicGFjazovLy8uL3NyYy9DYXJkLmpzIiwid2VicGFjazovLy8uL3NyYy9HYW1lLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsVUFBVTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1Qjs7Ozs7Ozs7Ozs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEVBQTBFLFNBQVM7O0FBRW5GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxRTtBQUNBO0FBQ0EsRztBQUNBOzs7QUFHQTs7Ozs7Ozs7Ozs7OztBQ2xDQSxjQUFjLG1CQUFPLENBQUMsK0JBQVM7QUFDL0IsYUFBYSxtQkFBTyxDQUFDLDZCQUFROztBQUU3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLE9BQU87QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE87QUFDQTtBQUNBO0FBQ0EsaUc7QUFDQSwwRjtBQUNBLGtGO0FBQ0E7QUFDQTtBQUNBLHdCO0FBQ0EsTztBQUNBLFc7QUFDQSx3QjtBQUNBLHdCO0FBQ0EsTztBQUNBLDBCO0FBQ0Esd0I7QUFDQSxzQjtBQUNBLE87QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQSxzQjs7Ozs7Ozs7Ozs7QUN0S0EsYUFBYSxtQkFBTyxDQUFDLDZCQUFRO0FBQzdCLGNBQWMsbUJBQU8sQ0FBQywrQkFBUztBQUMvQixhQUFhLG1CQUFPLENBQUMsNkJBQVE7O0FBRTdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwiY2xhc3MgQm9hcmQge1xuICBjb25zdHJ1Y3RvcihzaXplKXtcbiAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XG4gICAgICB0aGlzLm1hcCA9IG5ldyBBcnJheShzaXplKTtcbiAgICAgIGZvciggbGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrICl7XG4gICAgICAgICAgdGhpcy5tYXBbaV0gPSBuZXcgQXJyYXkoc2l6ZSk7XG4gICAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCb2FyZDsiLCJjbGFzcyBDYXJke1xuICBjb25zdHJ1Y3RvcihpZCwgaW1nLCBlbGVtZW50LCBjbGlja0NhbGxiYWNrKXtcbiAgICAgIHRoaXMuaWQ9aWQ7XG4gICAgICB0aGlzLmltZz1pbWc7XG4gICAgICB0aGlzLnNpZGU9ZmFsc2U7XG4gICAgICB0aGlzLmVsZW1lbnQ9ZWxlbWVudDtcbiAgICAgIHRoaXMuY2xpY2tDYWxsYmFjayA9IGNsaWNrQ2FsbGJhY2s7XG4gICAgICAvLyAgc2V0IGltZyBmb3IgZnJvbnQgYmFja2dyb3VuZFxuICAgICAgdGhpcy5lbGVtZW50LmNoaWxkcmVuWzBdLmNoaWxkcmVuWzFdLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJHt0aGlzLmltZ30pYDtcbiAgICAgIFxuICAgICAgLy8gYWRkIGxpc3RlbmVyIGZvciBjbGlja1xuICAgICAgdGhpcy5saXN0ZW5lciA9IChldmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMuY2xpY2tDYWxsYmFjayhldmVudCk7XG4gICAgICAgICAgdGhpcy5mbGlwKCk7XG4gICAgICB9XG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLHRoaXMubGlzdGVuZXIpO1xuICBcbiAgfVxuICBvbkZvdW5kKCl7XG4gICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLHRoaXMubGlzdGVuZXIpO1xuICB9XG4gXG4gIGZsaXAoKXtcbiAgICAgIHRoaXMuc2lkZT0hdGhpcy5zaWRlO1xuICAgICAgaWYodGhpcy5zaWRlKXtcbiAgICAgICAgICB0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0uc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZVkoMTgwZGVnKSc7XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICAgIHRoaXMuZWxlbWVudC5jaGlsZHJlblswXS5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlWSgwZGVnKSc7ICAgXG4gICAgICB9XG4gIH0gXG59XG5cblxubW9kdWxlLmV4cG9ydHM9Q2FyZFxuXG4iLCJjb25zdCBCb2FyZCA9IHJlcXVpcmUoJy4vQm9hcmQnKTtcbmNvbnN0IENhcmQgPSByZXF1aXJlKCcuL0NhcmQnKTtcblxuY2xhc3MgR2FtZSB7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudCxyZXN0YXJ0KXtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5jYXJkcyA9IFtdO1xuICAgICAgICB0aGlzLm9uQ2xpY2sgPSB0aGlzLm9uQ2xpY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5maXJzdENhcmQgPSBudWxsO1xuICAgICAgICB0aGlzLnJlc3RhcnQgPSByZXN0YXJ0O1xuICAgICAgICB0aGlzLnJlc3RhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCgpPT4gdGhpcy5pbml0KDgpKVxuICAgICAgICB0aGlzLnRpbWVySWQgPSBudWxsO1xuICAgICAgICB0aGlzLnNlY29uZCA9IDA7XG4gICAgICAgIHRoaXMubWludXRlID0gMDsgICAgICBcbiAgICAgICAgdGhpcy5ob3VyID0gMDtcbiAgICAgICAgdGhpcy5udW1iZXJPZkNhcmRzID0gMDtcbiAgICAgICAgdGhpcy5iZXN0UmVzdWx0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Jlc3VsdCcpID8gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Jlc3VsdCcpIDogMTAwMDA7XG4gICAgICAgIGlmKHRoaXMuYmVzdFJlc3VsdCA9PSAnMTAwMDAnKXtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5iZXN0UmVzdWx0JykuaW5uZXJIVE1MID0gJ2ZpcnN0IGdhbWUnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmVzdFJlc3VsdCcpLmlubmVySFRNTCA9IHRoaXMuYmVzdFJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0ZXAgPSAwO1xuICAgICAgICB0aGlzLnRpbWUgPSAwO1xuICAgIFxuICAgICAgfVxuICAgIFxuICAgIC8vIGRpc2FibGUgY2xpY2sgd2hpbGUgd2FpdGluZyBmb3IgdGltZW91dFxuICAgIGhhbmRsZUNsaWNrKGV2ZW50KXtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICAgIG9uQ2xpY2soZXZlbnQpe1xuICAgICAgICBjb25zdCBjYXJkRWxlbWVudCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgIGlmKCB0aGlzLmZpcnN0Q2FyZCA9PT0gbnVsbCApe1xuICAgICAgICAgICAgZm9yKCBsZXQgY2FyZCBvZiB0aGlzLmNhcmRzICl7XG4gICAgICAgICAgICAgICAgaWYoY2FyZC5lbGVtZW50ID09PSBjYXJkRWxlbWVudCApe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maXJzdENhcmQgPSBjYXJkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuZmlyc3RDYXJkICE9PSBudWxsKXtcbiAgICAgICAgICAgIGZvciggbGV0IGNhcmQgb2YgdGhpcy5jYXJkcyApe1xuICAgICAgICAgICAgICAgIGlmKGNhcmQuZWxlbWVudCA9PT0gY2FyZEVsZW1lbnQgKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoY2FyZC5pZCA9PT0gdGhpcy5maXJzdENhcmQuaWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZC5vbkZvdW5kKClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RDYXJkLm9uRm91bmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RDYXJkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FsY1dpbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLHRoaXMuaGFuZGxlQ2xpY2ssdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FyZC5mbGlwKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcnN0Q2FyZC5mbGlwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJzdENhcmQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZWxlbWVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLHRoaXMuaGFuZGxlQ2xpY2ssdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LDIwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSAgICAgXG4gICAgfVxuICAgIGluaXQoYm9hcmRTaXplKXtcbiAgICAgICAgdGhpcy5udW1iZXJPZkNhcmRzID0gYm9hcmRTaXplO1xuICAgICAgICB0aGlzLnN0ZXAgPSAwO1xuICAgICAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIHRoaXMuY2FyZHMgPSBbXTtcbiAgICAgICAgLy8gZmV0Y2ggY2FyZHNcbiAgICAgICAgZmV0Y2goJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9jYXJkcycpXG4gICAgICAgIC50aGVuKCBkYXRhID0+IGRhdGEuanNvbigpIClcbiAgICAgICAgLnRoZW4oIGpzb24gPT4ge1xuICAgICAgICAgICAganNvbj1qc29uLnNsaWNlKDAsYm9hcmRTaXplKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGpzb24pO1xuICAgICAgICAgICAgZm9yKCBsZXQgY2FyZEpzb24gb2YganNvbi5jb25jYXQoanNvbikgKXtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdDYXJkRWwgPSBnZXRDYXJkRWxlbWVudCgpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IGNhcmQgPSBuZXcgQ2FyZChjYXJkSnNvbi5pZCxjYXJkSnNvbi5pbWcsbmV3Q2FyZEVsLCB0aGlzLm9uQ2xpY2sgKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhcmRzLnB1c2goY2FyZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNodWZmbGVDYXJkcygpO1xuICAgICAgICAgICAgLy8gIGFwcGVuZCB0byBkb21cbiAgICAgICAgICAgIGZvciggbGV0IGNhcmQgb2YgdGhpcy5jYXJkcyl7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGNhcmQuZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLnRpbWVySWQpe1xuICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXJJZClcbiAgICAgICAgICAgICAgdGhpcy5zZWNvbmQgPSAwO1xuICAgICAgICAgICAgICB0aGlzLm1pbnV0ZSA9IDA7XG4gICAgICAgICAgICAgIHRoaXMuaG91ciA9IDA7XG4gICAgICAgICAgICAgIHRoaXMudGltZXJJZCA9IHNldEludGVydmFsKCgpPT50aGlzLnRpbWVyKCksMTAwMCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgIHRoaXMudGltZXJJZCA9IHNldEludGVydmFsKCgpPT50aGlzLnRpbWVyKCksMTAwMCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2FyZHMnLHRoaXMuY2FyZHMpXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCggZXJyID0+IGNvbnNvbGUubG9nKGVycikpXG4gICAgfVxuXG4gICAgc2h1ZmZsZUNhcmRzKCl7XG4gICAgICBmb3IoIGxldCBpID0gMDsgaTwyMDA7IGkrKyApe1xuICAgICAgICAgIHZhciBudW0xID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5jYXJkcy5sZW5ndGgpO1xuICAgICAgICAgIHZhciBudW0yID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5jYXJkcy5sZW5ndGgpO1xuICAgICAgICAgIGNvbnN0IHRlbXAgPSB0aGlzLmNhcmRzW251bTFdO1xuICAgICAgICAgIHRoaXMuY2FyZHNbbnVtMV0gPSB0aGlzLmNhcmRzW251bTJdO1xuICAgICAgICAgIHRoaXMuY2FyZHNbbnVtMl0gPSB0ZW1wO1xuICAgICAgfSAgIFxuICB9XG4gICAgdGltZXIoKXtcbiAgICAgIGNvbnN0IHNlY29uZFN0cj0odGhpcy5zZWNvbmQgPCAxMCkgPyAnMCcgKyB0aGlzLnNlY29uZC50b1N0cmluZygpIDogdGhpcy5zZWNvbmQudG9TdHJpbmcoKTsgICBcbiAgICAgIGNvbnN0IG1pbnV0ZXNTdHI9KHRoaXMubWludXRlPDEwKT8nMCcrdGhpcy5taW51dGUudG9TdHJpbmcoKTp0aGlzLm1pbnV0ZS50b1N0cmluZygpOyAgIFxuICAgICAgY29uc3QgaG91cnNTdHI9KHRoaXMuaG91cjwxMCk/JzAnK3RoaXMuaG91ci50b1N0cmluZygpOnRoaXMuaG91ci50b1N0cmluZygpOyAgIFxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kZW1vXCIpLmlubmVySFRNTCA9aG91cnNTdHIrXCI6XCIrbWludXRlc1N0citcIjpcIitzZWNvbmRTdHI7XG4gICAgICBpZiAodGhpcy5zZWNvbmQ8NTkpe1xuICAgICAgICAgIHRoaXMuc2Vjb25kKys7ICAgXG4gICAgICB9ICAgIFxuICAgICAgZWxzZXsgICAgICAgXG4gICAgICAgICAgdGhpcy5zZWNvbmQ9MDsgICAgICAgXG4gICAgICAgICAgdGhpcy5taW51dGUrKzsgICBcbiAgICAgIH0gICAgXG4gICAgICBpZiAodGhpcy5taW51dGU+NTkpeyAgICAgICBcbiAgICAgICAgICB0aGlzLm1pbnV0ZT0wOyAgICAgICBcbiAgICAgICAgICB0aGlzLmhvdXIrKzsgICAgXG4gICAgICB9IFxuICB9XG4gIGNhbGNXaW4oKXtcbiAgICB0aGlzLnN0ZXArKztcbiAgICBpZih0aGlzLnN0ZXAgPT09IHRoaXMubnVtYmVyT2ZDYXJkcyApe1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLm1pbnV0ZSo2MCArIHRoaXMuc2Vjb25kO1xuICAgICAgICB0aGlzLmJlc3RSZXN1bHQgPSBwYXJzZUludCh0aGlzLmJlc3RSZXN1bHQpIDwgcmVzdWx0ID8gdGhpcy5iZXN0UmVzdWx0IDogcmVzdWx0O1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVzdWx0JywgIEpTT04uc3RyaW5naWZ5KHRoaXMuYmVzdFJlc3VsdCkgKTtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySWQpO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmVzdFJlc3VsdCcpLmlubmVySFRNTCA9IHRoaXMuYmVzdFJlc3VsdDtcbiAgICAgICBcbiAgICB9XG4gICAgXG59XG59XG5cblxuZnVuY3Rpb24gZ2V0Q2FyZEVsZW1lbnQoKXtcbiAgICBjb25zdCBjYXJkQ29udGFpbmVyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNhcmRDb250YWluZXIuY2xhc3NOYW1lID0gJ2NhcmQnO1xuXG4gICAgY2FyZENvbnRhaW5lci5pbm5lckhUTUw9IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtaW5uZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWJhY2tcIj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWZyb250XCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGA7XG4gICAgcmV0dXJuIGNhcmRDb250YWluZXI7XG59XG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7IiwiY29uc3QgQ2FyZCA9IHJlcXVpcmUoJy4vQ2FyZCcpO1xuY29uc3QgQm9hcmQgPSByZXF1aXJlKCcuL0JvYXJkJyk7XG5jb25zdCBHYW1lID0gcmVxdWlyZSgnLi9HYW1lJyk7XG5cbmNvbnN0IGdhbWVFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUnKTtcbmNvbnNvbGUubG9nKGdhbWVFbGVtZW50KTtcbmNvbnN0IHJlc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVzdGFydCcpO1xuY29uc3QgZ2FtZSA9IG5ldyBHYW1lKGdhbWVFbGVtZW50LHJlc3RhcnRCdG4pO1xuZ2FtZS5pbml0KDgpOyBcbmdhbWUudGltZXIoKTtcblxuXG5cblxuIl0sInNvdXJjZVJvb3QiOiIifQ==