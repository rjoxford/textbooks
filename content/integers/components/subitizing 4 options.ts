// // =============================================================================
// // Subitizing Component
// // (c) Mathigon
// // =============================================================================


// import {Point, Random} from '@mathigon/fermat';
// import {CustomElementView, register, $N, animate, SVGView, ElementView} from '@mathigon/boost';
// import { text } from 'd3';

// //////////////////////   Functions        //////////////////////
// function shuffleArray(array: any[]) {
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }
// }

// //////////////////////   Answer Option    //////////////////////
// class AnswerOption {
//     constructor(value: number, position: Point, $svg: ElementView, sendAction: any){
//         this.$svg = $svg
//         this.value = value
//         // this.$element = {}
//         this.position = position

//         // Render the element
//         const $circle = $N('circle', {r: 50, fill: 'blue'}, this.$svg) as SVGView;
//         const $text = $N('text', {text: value}, $svg  ) as SVGView;
//         $text.setCenter(position)
//         $circle.setCenter(position)
        
//         $circle.enter('fade')
//         $circle.on('click', ()=>this.onClick())
//         // this.$elements = $circle
//         this.$elements = []
//         this.$elements.push($circle, $text)
        
//         this.sendAction = sendAction
//     }
//     sendAction: any
//     value: number
//     $elements: any[]
//     $svg: ElementView
//     position: Point
//     createElement(){
//         // const $element = $N('circle', {r: 30, fill: 'blue'}, this.$svg) as SVGView;
//         // $element.setCenter(new Point(40, 40))
//         // this.$element = $element
//     }
//     destroyElement(){
//         // this.$elements.forEach(element=>{
//         //     element.exit('fade', 2000).promise.then(()=>{
//         //         element.remove()
//         //     })
//         // })
//         this.$elements.forEach(element=>{
//                 element.remove()
//         })
//     }
//     destroy(){
//         this.$elements.forEach(element=>{
//             element.remove()
//         })
//     }
//     onClick(){
//         this.destroyElement()
//         // Delay while element fades out
//         // setTimeout(()=>{this.sendAction(this.value)}, 2000)
//         this.sendAction(this.value)
//     }
// }

// //////////////////////   AnswersSet    //////////////////////

// class AnswerSet {
//     // TODO - Make flexible for different amounts of options
//     constructor(options: any[], $svg: ElementView, sendAction: (answer: number) => void){
//         this.callAction = sendAction
//         this.options = []
//         // TODO - make intelligent grid for different amounts of points (for different difficulties)
//         const g = 120
//         const positions = [
//             new Point(g, g),
//             new Point(2*g, g),
//             new Point(g, 2*g),
//             new Point(2*g, 2*g)
//         ]
//         options.forEach((item, i)=>{
//             const opp = new AnswerOption(item, positions[i], $svg, this.action.bind(this))
//             this.options.push(opp)
//         })
//     }
//     options: any[]
//     callAction: any
//     action(answer: number){
//         this.clearOptions()
//         this.callAction(answer)
//     }
//     clearOptions(){
//         this.options.forEach(option=>{
//             option.destroy()
//         })
//     }
//     positions(){
//         // Load array of options
//         // From array length, work out number of rows and columns required
//     }
// }



// //////////////////////   Round    //////////////////////
// class Round {
//     constructor(roundNo: number, numBalls: number, $svg: ElementView, onRoundComplete: any){
//         this.roundNo = roundNo
//         this.numBalls = numBalls
//         this.$svg = $svg
//         this.$elements = []
//         this.onRoundComplete = onRoundComplete
//     }
//     roundNo: number
//     answer: number
//     numBalls: number
//     $elements: any []
//     $svg: ElementView
//     props: any
//     playRound(){
//         const randomDelay = 2000 + Random.integer(3000)
//         setTimeout(()=>this.flashDots(), randomDelay)
//     }
//     flashDots(){
//         const $elements: SVGView[] = []
//         for (let i=0; i<this.numBalls ; i++){
//             const $ball = $N('circle', {r: 10, fill: 'red'}, this.$svg) as SVGView;
//             $ball.setCenter(new Point (Random.integer(40, 460), Random.integer(40, 460)))
//             $elements.push($ball)
//         }
//         animate((t)=>{}, 300).promise.then(()=>{
//             const count = $elements.length
//             $elements.forEach((element, i)=>{
//                 element.remove()
//                 if(i===count-1){this.flashCompleted()}
//             })
//         })
//     }
//     flashCompleted(){
//         this.showOptions()
//     }
//     destroyDots(){
//         this.$elements.forEach(ball=>{ball.remove()})
//     }
//     showOptions(){
//         const numberOptions = 4 // TODO - different number of options for different difficulties
//         const possAnswers: Array<number> = []
//         let randomNumber
//         if (this.numBalls<numberOptions){
//             randomNumber = Random.integer(this.numBalls)
//         } else {
//             randomNumber = Random.integer(numberOptions)
//         }
//         for (let i = 0; i<numberOptions; i++){
//             console.log(`Number balls is ${this.numBalls}`)
//             const number = this.numBalls+i-randomNumber
//             console.log(number)
//             possAnswers.push(number)
//         }
//         new AnswerSet(possAnswers, this.$svg, this.answerChosen.bind(this))   
//     }
//     answerChosen(answer: number){
//         this.answer = answer
//         if (answer === this.numBalls){
//             alert("Correct. Great job!")
//         } else {
//             alert("Do better next time!")
//         }
//         this.roundCompleted()
//     }
//     onRoundComplete: (playRound: number) => void
//     roundCompleted(){
//         console.log(`Round ${this.roundNo} completed}`)
//         // Call next round 
//         this.onRoundComplete(this.roundNo+1)
//     }
// }



// //////////////////////   Controller    //////////////////////
// class Controller {
//     constructor(numRounds: number, $parentElement: CustomElementView){
//         const $svg = $N('svg', {width: 500, height: 500}, $parentElement);
//         this.$svg = $svg
//         this.difficulty = "easy"
//         this.numRounds = numRounds
//         this.props = {}
//         this.props.$parentElement = $parentElement
//         this.$parent = $parentElement
//         this.rounds = []
//         this.createRounds()
//         this.playRound(0)
//     }
//     $svg: ElementView;
//     $parent: CustomElementView;
//     rounds: Array<Round>
//     difficulty: string // TODO
//     numRounds: number
//     props: any
//     createRounds(){
//         for (let i=0 ; i < this.numRounds ; i++){
//             const round = new Round(i, Random.integer(1, 10), this.$svg, this.playRound.bind(this))
//             this.rounds.push(round)
//         }
//     }
//     playRound(i: number){
//         this.rounds[i].playRound()
//     }
// }



// ////////////////////   Export    //////////////////////
// @register('x-subitizing')
// export class SubitizingGame extends CustomElementView {

//   ready() {

//     const controller = new Controller(20, this)

//   }
  
// }