// =============================================================================
// Fractions Component
// (c) Mathigon
// =============================================================================


import {Point, Random} from '@mathigon/fermat';
import {CustomElementView, register, $N, animate, SVGView, ElementView} from '@mathigon/boost';
import { text, svg } from 'd3';
import { Box2 } from 'three';

//////////////////////   Functions        //////////////////////
function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


//////////////////////   Answer Option    //////////////////////



//////////////////////   Round    //////////////////////
class Round {
    constructor(roundNumber: number, fraction: {numerator: number; denominator: number},
             $svg: ElementView, playNextRound: any){
        this.roundNumber = roundNumber
        this.fraction = fraction
        this.$svg = $svg
        this.$elements = []
        this.playNextRound = playNextRound
        // this.createElements()
    }
    fraction: {numerator: number; denominator: number}
    roundNumber: number
    diff: number | undefined
    $elements: Array<SVGView>
    $svg: ElementView
    playNextRound: any
    startRound(){
        this.createElements()
    }
    endRound(){
        this.destroyElements()
        this.playNextRound(this.roundNumber+1)
    }
    clickAction(e){
        // 
        this.endRound()
    }
    createElements(){
        const boxWidth = 400
        const $box = $N('rect', {x: 100, y:100, width: boxWidth, 
            height: 100, fill: 'blue', stroke: '#736357',
            'stroke-width': 8}, this.$svg) as SVGView;
        
        const text = `Target: ${this.fraction.numerator}/${this.fraction.denominator}`
        const $text = $N('text', {text: text}, this.$svg  ) as SVGView;
        const centre = new Point(300, 150)
        $text.setCenter(centre)
        
        const target = Math.round(boxWidth * this.fraction.numerator / this.fraction.denominator)+100

        // Register onclick event
        $box.on('click', (e)=>{
            this.diff = Math.abs(e.layerX - target)
            const message = `You got ${e.layerX}. The target was ${target}`
            alert(message)
            this.clickAction(e)
        })

    }
    destroyElements(){
        this.$elements.forEach(element=>element.remove())
    }
}


//////////////////////   Controller    //////////////////////
class Game {
    constructor(numRounds: number, parentElement: CustomElementView){

        this.$svg = $N('svg', {width: 800, height: 600}, parentElement);

        this.rounds = []
        for (let i = 0 ; i < numRounds ; i++){
            const round = new Round(i, this.makeFraction('easy'), this.$svg, this.playRound.bind(this))
            this.rounds.push(round)
        }
        this.playRound(0)
    }
    $svg: ElementView
    rounds: any[]
    makeFraction(difficulty: string) {
        const denominator = Random.integer(2, 10)
        const numerator = Random.integer(1, denominator-1)
        return {numerator, denominator}
    }
    playRound(i){
        this.rounds[i].startRound()
    }
    
}



////////////////////   Export    //////////////////////
@register('x-fractions')
export class SubitizingGame extends CustomElementView {

  ready() {

    const controller = new Game(10, this)

  }
  
}