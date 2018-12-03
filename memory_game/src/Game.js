const Card = require('./Card');

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