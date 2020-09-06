// =============================================================================
// Abacus Component
// (c) Mathigon
// =============================================================================


import {Point, Line, Random} from '@mathigon/fermat';
import {CustomElementView, register, $N, animate, SVGView, slide, ElementView} from '@mathigon/boost';
import { getOrderColor } from './ordinal-colors';


////////////////////   Functions    //////////////////////
function valueOfOrder(number: number, base: number, order: number){
    return (Math.floor(number / base**(order))) % base
}


////////////////////   Abacus    //////////////////////
class Abacus {
    // 
    constructor(value: number, base: number, orderMax: number, orderMin: number, 
            width: number, height: number, parentElement: CustomElementView){

        this.$svg = $N('svg', {width, height}, parentElement);

        this.base = base;
        this.numColumns = orderMax - orderMin+1;
        this.orderMax = orderMax
        this.orderMin = orderMin
        
        const margin = 30
        this.dimensions = {
            height,
            width,
            margin,
            ballRadius : 12,
            columnTop : margin,
            columnBottom : height - 2*margin,
            columnWidth : (width - 2*margin) / this.numColumns
        }
        
    }
    $svg: ElementView;
    columns: Array<Column> | undefined
    dimensions: any
    base: number
    orderMin: number
    orderMax: number
    value = 0
    numColumns: number
    createColumns(){
        // Create the columns
        this.columns = []
        const update = this.updateAbacus.bind(this)
        for (let i=0; i<this.numColumns; i++){
            const xpos = this.dimensions.width - this.dimensions.margin - i * this.dimensions.columnWidth
            const top = new Point(xpos, this.dimensions.columnTop)
            const bottom = new Point(xpos, this.dimensions.columnBottom)
            const columnValue = valueOfOrder(this.value, this.base, i)
            const columnOrder = i
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            this.columns.push(new Column(columnValue, this.base, columnOrder, top, bottom, this.$svg, update))
        }
    }
    dropColumns(){
        this.columns = []
    }
    updateAbacus(order: number){
        if (!this.columns?.length){return}
        let abacusValue = 0
        this.columns.forEach(column=>{
            const columnValue = column.value * Math.pow(this.base, column.order)
            abacusValue = abacusValue + columnValue
        })
        this.value = abacusValue
        console.log(this.value)
    }
    drawAll(){
        if (!this.columns?.length){return}
        this.columns.forEach(column=>{
            column.drawColumn()
            column.drawBalls()
        })
    }
    eraseAll(){
        if (!this.columns?.length){return}
        this.columns.forEach(column=>{
            column.eraseColumn()
            column.eraseBalls()
        })
    }
    setAbacusValue(value?: number){
        this.eraseAll()
        const val = value || this.value
        // Set abacus to a given value
        // Set the value of each column
        this.columns?.forEach(column=>{
            column.value = valueOfOrder(val, this.base, column.order)
        })

        this.drawAll()
    }
    init(){
        this.createColumns()
        this.drawAll()
    }
    restart(){
        this.eraseAll()
        this.dropColumns()
        this.createColumns()
        this.drawAll()
    }
}


//////////////////////   Column    //////////////////////
class Column {
    constructor(value: number, base: number, order: number, top: Point, bottom: Point, $svg: ElementView, 
        updateAbacus: { (order: number): void; (order: number): void }){
        
        // 
        this.color = getOrderColor(order)
        this.value = value
        this.$svg = $svg
        this.order = order
        this.top = top
        this.bottom = bottom
        this.base = base

        // Create and render a set of balls
        //this.createBalls()
        const updateColumn = this.updateColumn.bind(this)
        this.balls = []
        for(let ballNo =1; ballNo<base ; ballNo++){
            let isCounted = false
            if (ballNo<this.value+1){
                isCounted = true
            }
            const column = {top: this.top, bottom: this.bottom}
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            this.balls.push(new Ball(base, ballNo, isCounted, column, 12, this.color, $svg, updateColumn))
        }
        this.updateAbacus = updateAbacus

        // Set update action
        //this.update = update
    }
    $element: SVGView | undefined
    $svg: ElementView
    order: number
    top: Point
    bottom: Point
    color: string
    balls: Array<Ball>
    base: number;
    value: number
    setValue(){
        // Counts the number of balls that have isCounted: true
        let columnValue = 0
        this.balls.forEach(ball=>{if (ball.isCounted){columnValue=columnValue+1}})
        this.value = columnValue
    }
    updateColumn(){
        // Update the value of this column
        this.setValue()
        // Call updateAbacus and pass this column's new value, with order
        this.updateAbacus(this.order)
        this.updateDraggables()
    }
    updateAbacus: (order: number) => void
    updateDraggables(){
        // TODO this will not be compatable with moving multiple balls at once
        if (this.value===0){this.setDraggable([1])}
        if (this.value<1  && this.value<this.base){this.setDraggable([])}
        if (this.value===this.base){this.setDraggable([this.base])}
    }
    setDraggable(ballNos: any[]){
        // Set all draggables to false
        this.balls.forEach(ball=>ball.isDraggable = false)
        // Set each given to true
        ballNos.forEach(ballNo=>{
            this.balls.forEach(ball=>{
                if (ball.ballNo === ballNo){ball.isDraggable=false}
            })
        })
    }
    createBalls(){
        // for(let ballNo =1; ballNo<10 ; ballNo++){
        //     const column = {top: this.top, bottom: this.bottom}
        //     let ball = new Ball(this.order, 10-ballNo, column, 10, this.color, this.$container, this.update)
        // }
    }
    drawBalls(){
        this.balls.forEach(ball=>ball.drawBall())
    }
    eraseBalls(){
        this.balls.forEach(ball=>ball.eraseBall())
    }
    drawColumn(){
        //Create and render the line
        this.$element = $N('line', {stroke: 'red'}, this.$svg) as SVGView;
        this.$element.setLine(this.top, this.bottom)
    }
    eraseColumn(){
        if (this.$element){this.$element.remove()}
    }
    createLabel(){
        // TODO - Create a label underneath showing 1-value, (2-order -dev)
    }
}


//////////////////////   Ball    //////////////////////
class Ball {
    constructor(base: number, ballNo: number, isCounted: boolean, column: { top: any; bottom: any}, r: number, color: string,
            $svg: ElementView, callUpdateColumn: { (ballNo: number): void; (arg0: number): void }){
        // Set max and min height for the ball
        const y = {
            top: column.top.y + r + ((base-ballNo) * 2*r),
            bottom: column.bottom.y - r - (ballNo)*2*r,
            centre: ((column.top.y + r + ((base-ballNo) * 2*r))+(column.bottom.y - r - (ballNo)*2*r))/2,
            actual: 0,
            end: 0
        }
        if (isCounted) {y.actual = y.bottom} else {y.actual = y.top}
        this.y = y
        const x = column.top.x
        this.x = x
        this.isCounted = isCounted

        // Number and order
        this.ballNo = ballNo
        this.r = r
        this.$svg = $svg
        this.color = color
        
        this.callUpdateColumn = callUpdateColumn
    }
    ballNo: number;
    x: any
    y: any
    r: number
    color: string
    $svg: ElementView
    $element: SVGView | undefined
    isCounted: boolean
    callUpdateColumn: any
    setIsCounted(bool: boolean){
        this.isCounted = bool
    }
    drawBall(){
        // Draw the ball, either at its top position or bottom position
        const $ball = $N('circle', {r: this.r, fill: this.color}, this.$svg) as SVGView;
        this.$element = $ball;            
        this.$element.setCenter(new Point(this.x, this.y.actual))

        // Set slide action
        const setIsCounted = this.setIsCounted.bind(this)
        const y = this.y
        const x = this.x
        const ballNo = this.ballNo
        const callUpdateColumn = this.callUpdateColumn
        if (this.isDraggable){
            slide($ball, {
                move(posn){
                    // Case above Top
                    if (posn.y < y.top){y.actual = y.top}
                    // Case within range
                    if (posn.y > y.top && posn.y < y.bottom){y.actual = posn.y}
                    // Case below bottom
                    if (posn.y > y.bottom) {y.actual = y.bottom}
                    const dest = new Point(x, y.actual)
                    $ball.setCenter(dest)
                    //console.log(`Moving ball number: ${ballNo} of order: ${order}`)
                }, 
                end(posn){
                    if (posn.y<y.centre){setIsCounted(false)} else {setIsCounted(true)}
                    // Animate movement up or down if left in limbo
                    if (posn.y > y.top && posn.y < y.bottom){
                        // Animate the ball to finishing point if past centre
                        if (posn.y<y.centre){y.end = y.top} else {y.end = y.bottom}
                        const dy = y.end - posn.y
                        animate((t) => {
                            const newPosY = posn.y + dy * t
                            $ball.setCenter(new Point(x, newPosY));
                        }, 500);
                    }
                    callUpdateColumn(ballNo)
                }
            })
        }
    }
    eraseBall(){
        if (this.$element){this.$element.remove()}
    }
    isDraggable = true // TODO
}



@register('x-abacus')
export class AbacusComponent extends CustomElementView {

    abacus: Abacus | undefined
    ready() {

        const width = parseInt(this.attr('width')) || 600
        const height = parseInt(this.attr('height')) || 500
        const base = parseInt(this.attr('base')) || 10
        const value = parseInt(this.attr('n')) || 132

        this.abacus = new Abacus(value, base, 5, 0, width, height, this)
        this.abacus.init()
    }
}

