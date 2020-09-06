// =============================================================================
// Grouping-dots Component
// (c) Mathigon
// =============================================================================


import {Point, Random, log} from '@mathigon/fermat';
import {CustomElementView, register, $N, animate, SVGView, ElementView} from '@mathigon/boost';

// TODO -
import {getOrderColor} from '../components/ordinal-colors'

const ballRadius = 8;
const movementTime = 6000

class Ball {
    constructor(id: number, x: number, y: number, r: number, order: number, 
        $svg: ElementView, isLastBall: boolean, 
        startCoalescence: ((order: number) => void)){
        // Ball Id to also store order, and be primed with one million to allow for order 0
        // TODO Ids no longer needed. Remove
        this.id =  id + 1000000
        const point = new Point(x,y)
        this.point = point
        this.order = order
        this.startCoalescence = startCoalescence
        this.r = r;
        this.color = getOrderColor(order);
        this.isLastBall = isLastBall
        this.$svg = $svg
    }
    id: number;
    point: Point;
    r: number;
    isLastBall = false
    color: string
    order: number
    startCoalescence: ((order: number) => void)
    destination: Point | undefined;
    $svg: ElementView;
    $element: SVGView | undefined;
    // TODO Animation Fraction property - 
    // Min of 0.3? then + ballNo/Allballs *0.7 ??
    // Will also require sorting of balls by distance from mean at creation
    drawBall(){
        const $element = $N('circle', {id: "ball-"+ this.id , r: this.r, fill: this.color}, 
            this.$svg) as SVGView
        $element.setCenter(this.point)
        this.$element = $element
        return $element
    }
    eraseBall(){
        if (this.$element){this.$element.remove()}
    }
    distance(destination: Point){
        const dx = destination.x - this.point.x 
        const dy = destination.y - this.point.y
        return Math.sqrt(dx**2 + dy**2)
    }
    processGroup(mean: Point){
        if (this.order > 0) {this.drawBall()}
        this.coalesce(mean)
        this.eraseBall()
    }
    // processRemainder(orderMax: any){
        
    // }
    coalesce(destination: Point){
        const dx = destination.x - this.point.x 
        const dy = destination.y - this.point.y          
        animate(t => {
            const newPosX = this.point.x + dx * t
            const newPosY = this.point.y + dy * t
            const point = new Point(newPosX, newPosY)
            if (this.$element){this.$element.setCenter(point)}
            }, movementTime).promise.then(()=>{
                this.eraseBall()
                // If the ball is the last of its group, then call action to coaelesce next group
                if (this.isLastBall){this.startCoalescence(this.order+1)}
            });
    }
    moveTo(destination: Point){
        const dx = destination.x - this.point.x 
        const dy = destination.y - this.point.y          
        animate(t => {
            const newPosX = this.point.x + dx * t
            const newPosY = this.point.y + dy * t
            const point = new Point(newPosX, newPosY)
            if (this.$element){this.$element.setCenter(point)}
            }, movementTime)
    }
}

class Order {
    constructor(order: number, groups: any[], remainders: any[]){
        this.order = order
        this.groups = groups
        this.remainders = remainders
    }
    order: number
    groups: Array<Group>
    remainders: Array<Ball>
    eraseAll(){
        this.groups.forEach(group=>group.eraseAll())
        this.remainders.forEach(remainder=>remainder.eraseBall())
    }
}


class Group {
    // 
    constructor(balls: any[], mean: Point){
        this.balls = balls
        this.mean = mean
    }
    balls: Array<Ball>
    mean: Point
    drawAll(){
        this.balls.forEach(ball=>ball.drawBall())
    }
    eraseAll(){
        this.balls.forEach(ball=>ball.eraseBall())
    }
    coalesceAll(): void{
        this.balls.forEach((ball: { coalesce: (arg0: Point) => void })=>{
            ball.coalesce(this.mean)
        })
    }
}

class Controller {
    constructor(numBalls: number, base: number, dimensions: {width: number; height: number},
            $svg: ElementView){
        // Set the balls
        this.numBalls = numBalls
        this.base = base
        this.balls = []
        this.orders = []
        this.dimensions = dimensions
        this.$svg = $svg
    }
    numBalls: number
    base: number
    dimensions: {width: number; height: number}
    $svg: ElementView
    orders: Array<Order>
    balls: Array<Ball>
    initialBalls: Array<Ball> | undefined
    createInitialBalls(){
        for ( let id = 0 ; id < this.numBalls ; id++ ) {
            const posx = Random.integer(40, this.dimensions.width-40)
            const posy = Random.integer(40, this.dimensions.height-40)
            let isLastBall = false
            if (id === this.numBalls-1){isLastBall=true}
            const ball = new Ball(id, posx, posy, ballRadius, 0, this.$svg, isLastBall, this.start.bind(this))
            this.balls.push(ball)
        }
    }
    drawInitialBalls(){
        this.balls?.forEach(ball=>ball.drawBall())
    }
    eraseInitialBalls(){
        this.balls.forEach(ball=>ball.eraseBall())
    }
    createOrders(){
        let remainingBalls = this.balls
        const orderMax = Math.floor(log(this.numBalls, this.base))
        for (let order = 0; order < orderMax + 1; order++){
            // Work out number of remainders
            const ballCount = remainingBalls.length
            const remainderCount = ballCount % this.base

            // Split all the balls
            const sortedByX = remainingBalls.sort((a, b) => a.point.x - b.point.x) 
            const remainders = sortedByX.slice(ballCount-remainderCount)
            let forGrouping = sortedByX.slice(0, ballCount - remainderCount)
            // Split the forGrouping into groups
            let means = []
            let groups = []
            const groupsCount = forGrouping.length/this.base

            for (let j=0; j<groupsCount; j++){
                const groupsByDistance = this.getMostDistantGroup(forGrouping)
                const nearest = groupsByDistance.nearest
                const mean = this.getMean(nearest)
                means.push(mean)
                groups.push(new Group(nearest, mean))

                forGrouping = groupsByDistance.furthest
            }
            
            // Make the new Order
            this.orders.push(new Order(order, groups, remainders))
            // Get the means for each group 
            let nextOrderBalls: any[] = []
            means.forEach((mean, index)=>{
                let isLastBall = false
                if (index === means.length-1){isLastBall = true}
                const radius = 10 + (3*(order+1))  // Play around to make higher order balls bigger
                const newBall = new Ball(index+(order)*1000, mean.x, mean.y, radius , 
                    order+1, this.$svg, isLastBall , this.start.bind(this))
                nextOrderBalls.push(newBall)
            })
            remainingBalls = nextOrderBalls
            // Reset the means array
            means = []
            nextOrderBalls = []
            groups = []
        }
    }
    eraseOrders(){
        this.orders.forEach(order=>order.eraseAll())
    }
    hasBeenRun = false
    start(order: number) {
        if (order>0){
            this.orders[order].remainders.forEach(ball=>ball.drawBall())
        } 
        if (this.orders[order].groups) {
            this.orders[order].groups.forEach(group=>{
                if(order>0){group.drawAll()}
                group.coalesceAll()
            })
        }
        if (order === this.orders.length-1 ){
            // if (this.orders[])
            if (this.orders[order].remainders.length){this.moveRemainders()}
            
            // this.moveRemainders()
            
        }
    }
    restart(){
        // Clear all rendered balls
        this.eraseInitialBalls()
        this.eraseOrders()

        // Clear arrays
        this.balls = []
        this.orders = []

        // Then start again
        this.createInitialBalls()
        this.drawInitialBalls()
        this.createOrders()
    }
    moveRemainders(){
        // TODO - move the remainders to central columns, as per abacus
        this.orders.forEach((order, i)=>{
            const xpos = this.dimensions.width / 2 - 60 * (i - this.orders.length / 2)
            const ypos = this.dimensions.height * 2 / 3
            const sortedRemainders = order.remainders.sort((a, b)=>b.point.y - a.point.y)
            sortedRemainders.forEach((ball, j)=>{
                const dest = new Point(xpos, ypos-40*j)
                ball.moveTo(dest)
            })
        })
    }
    getMean(balls: any[]): Point {
        const initial = 0
        const x = balls.reduce((acc, cur, )=>{return acc + cur.point.x}, initial) / balls.length
        const y = balls.reduce((acc, cur, )=>{return acc + cur.point.y}, initial) / balls.length
        return new Point(x, y)
    }
    distancesFromPoint(point: Point): any[] {
        return this.balls.map((ball)=>{
            return {
                ballId: ball.id,
                distance: ball.distance(point),
                point: ball.point
            }
        })
    }

    mostDistant(balls: any[], point: Point): number {
        // Returns the id of the most distant ball from a point
        // Calculate all distances from mean
        const distances = balls.map((ball)=>{
            return {
                ballId: ball.id,
                distance: ball.distance(point),
            }
        })
        // Get id of most distant ball
        let maxDistance = 0
        let mostDistant = distances[0].ballId 
        distances.forEach((item)=>{
            if (item.distance>maxDistance){
                mostDistant = item.ballId
                maxDistance = item.distance
            }
        })
        return mostDistant
    }
    getBallbyId(balls: any[], ballId: number){
        return balls.find( ball => ball.id === ballId)
    }

    getMostDistantGroup(balls: any[]) {
        // Get the mean distant
        const mean = this.getMean(balls)
        const mostDistantId = this.mostDistant(balls, mean)
        const mostDistant = this.getBallbyId(balls, mostDistantId)

        // Sort to get the (base*) proximal balls to distant
        const sortedByDistance = balls.sort((a, b)=> a.distance(mostDistant.point) - b.distance(mostDistant.point))
        const nearest = sortedByDistance.slice(0, this.base)
        const furthest = sortedByDistance.slice(this.base)

        return {nearest, furthest}
    }
}


@register('x-grouping')
export class GroupingComponent extends CustomElementView {

    controller: Controller | undefined

    ready() {
    
        const width = parseInt(this.attr('width')) || 800
        const height = parseInt(this.attr('height')) || 600
        const $svg = $N('svg', {width, height}, this);
        const dimensions = {width, height}

        const n = parseInt(this.attr('n')) || 167
        const base = parseInt(this.attr('base')) ||4

        this.controller = new Controller(n, base, dimensions, $svg)

}}


