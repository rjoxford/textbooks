// =============================================================================
// Subitizing Component
// (c) Mathigon
// =============================================================================


import {Point, Random} from '@mathigon/fermat';
import {CustomElementView, register, $N, animate, SVGView, ElementView} from '@mathigon/boost';
import { text } from 'd3';

//////////////////////   Functions        //////////////////////
function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

//////////////////////   Answer Option    //////////////////////
class AnswerPadButton {
    constructor(value: number, position: Point, buttonRadius: number, $svg: ElementView, sendAction: any){
        this.$svg = $svg
        this.value = value
        // this.$element = {}
        this.position = position

        // Render the element
        const $circle = $N('circle', {r: buttonRadius, fill: 'teal'}, this.$svg) as SVGView;
        const $text = $N('text', {text: value}, $svg  ) as SVGView;
        $text.setCenter(position)
        $circle.setCenter(position)
        
        $circle.enter('fade')
        $circle.on('click', ()=>this.onClick())
        $text.on('click', ()=>this.onClick())
        // this.$elements = $circle
        this.$elements = []
        this.$elements.push($circle, $text)
        
        this.sendAction = sendAction
    }
    sendAction: any
    value: number
    $elements: any[]
    $svg: ElementView
    position: Point
    createElement(){
        // const $element = $N('circle', {r: 30, fill: 'blue'}, this.$svg) as SVGView;
        // $element.setCenter(new Point(40, 40))
        // this.$element = $element
    }
    destroyElement(){
        // this.$elements.forEach(element=>{
        //     element.exit('fade', 2000).promise.then(()=>{
        //         element.remove()
        //     })
        // })
        this.$elements.forEach(element=>{
                element.remove()
        })
    }
    destroy(){
        this.$elements.forEach(element=>{
            element.remove()
        })
    }
    onClick(){
        this.destroyElement()
        // Delay while element fades out
        // setTimeout(()=>{this.sendAction(this.value)}, 2000)
        this.sendAction(this.value)
    }
}

//////////////////////   AnswersSet    //////////////////////

class AnswerPad {
    // TODO - Make flexible for different amounts of options
    constructor(options: any[], $svg: ElementView, sendAction: (answer: number) => void, dimensions: {}){
        this.callAction = sendAction
        this.dimensions = dimensions
        const rows = 3 //TODO, assumed width/cols < height/rows. Add in function to return the smaller of the two
        const cols = 4
        const g = 500  / (cols+2)
        this.buttons = []
        for (let i = 0; i < 12; i++) {
            const x = g + (i%(cols))*g
            const y = g + Math.floor(i/(cols))*g
            const position = new Point(x, y)
            this.buttons.push(new AnswerPadButton(i+1, position, g/2-20, $svg, this.action.bind(this)))
        }
    }
    dimensions: {}
    callAction: any
    buttons: Array<AnswerPadButton>
    action(answer: number){
        this.clearButtons()
        this.callAction(answer)
    }
    clearButtons(){
        this.buttons.forEach(button=>{
            button.destroy()
        })
    }
    positions(){
        // Load array of options
        // From array length, work out number of rows and columns required
    }
}

// class StartScene {
//     constructor(dimensions, $svg){
//         this.dimensions = dimensions
//         this.$svg = $svg
//     }
//     $elements: any[] |undefined
//     start(){
//         // Create a ball
//         newShape = 
//         // Remove a random ball
//     }
//     end(){}
//     $svg: ElementView


// }


//////////////////////   Round    //////////////////////
class Round {
    constructor(roundNo: number, numBalls: number, $svg: ElementView, onRoundComplete: any, dimensions: {}){
        this.roundNo = roundNo
        this.numBalls = numBalls
        this.$svg = $svg
        this.dimensions = dimensions
        this.$elements = []
        this.onRoundComplete = onRoundComplete
    }
    roundNo: number
    answer = 0
    numBalls: number
    $elements: any []
    $svg: ElementView
    props: any
    dimensions: {}
    playRound(){
        const randomDelay = 2000 + Random.integer(3000)
        setTimeout(()=>this.flashDots(), randomDelay)
    }
    flashDots(){
        const $elements: SVGView[] = []
        for (let i=0; i<this.numBalls ; i++){
            const $ball = $N('circle', {r: 10, fill: 'red'}, this.$svg) as SVGView;
            $ball.setCenter(new Point (Random.integer(40, 460), Random.integer(40, 460)))
            $elements.push($ball)
        }
        animate((t)=>{ }, 300).promise.then(()=>{
            const count = $elements.length
            $elements.forEach((element, i)=>{
                element.remove()
                if(i===count-1){this.flashCompleted()}
            })
        })
    }
    flashCompleted(){
        this.showOptions()
    }
    destroyDots(){
        this.$elements.forEach(ball=>{ball.remove()})
    }
    showOptions(){
        const numberOptions = 4 // TODO - different number of options for different difficulties
        const possAnswers: Array<number> = []
        let randomNumber
        if (this.numBalls<numberOptions){
            randomNumber = Random.integer(this.numBalls)
        } else {
            randomNumber = Random.integer(numberOptions)
        }
        for (let i = 0; i<numberOptions; i++){
            const number = this.numBalls+i-randomNumber
            possAnswers.push(number)
        }
        new AnswerPad(possAnswers, this.$svg, this.answerChosen.bind(this), this.dimensions)   
    }
    answerChosen(answer: number){
        this.answer = answer
        if (answer === this.numBalls){
            // alert("Correct. Great job!")
        } else {
            // alert("Do better next time!")
        }
        this.roundCompleted()
    }
    onRoundComplete: (playRound: number) => void
    roundCompleted(){
        // Call next round 
        this.onRoundComplete(this.roundNo+1)
    }
}



//////////////////////   Controller    //////////////////////
class Controller {
    constructor(numRounds: number, $parentElement: CustomElementView){
        const dimensions = {width: 500, height: 500}
        this.dimensions = dimensions
        const $svg = $N('svg', dimensions, $parentElement);
        this.$svg = $svg
        this.difficulty = "easy"
        this.numRounds = numRounds
        this.props = {}
        this.props.$parentElement = $parentElement
        this.$parent = $parentElement
        this.rounds = []
        this.createRounds()
        this.playRound(0)
    }
    $svg: ElementView;
    $parent: CustomElementView;
    rounds: Array<Round>
    difficulty: string // TODO
    dimensions: {}
    numRounds: number
    props: any
    createRounds(){
        for (let i=0 ; i < this.numRounds ; i++){
            const round = new Round(i, Random.integer(1, 10), this.$svg, this.playRound.bind(this), this.dimensions)
            this.rounds.push(round)
        }
    }
    playRound(i: number){
        this.rounds[i].playRound()
        if (i===10){
            this.printAnswers()
        }
    }
    printAnswers(){
        let score = 0
        const answers = this.rounds.map((round, i)=>{
            const correct = (round.numBalls === round.answer)
            if (correct){score++}
            return {round: i+1, balls: round.numBalls, answer: round.answer, 
                correct: correct
            }
        })
        console.log(answers)
        alert(score)
    }
}



////////////////////   Export    //////////////////////
@register('x-subitizing')
export class SubitizingGame extends CustomElementView {

  ready() {

    const controller = new Controller(20, this)

  }
  
}