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

