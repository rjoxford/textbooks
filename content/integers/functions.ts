// =============================================================================
// Integers
// (c) Mathigon
// =============================================================================


import {list, wait, tabulate, isOneOf, Color, Obj} from '@mathigon/core';
import {clamp, Point, toWord, roundTo, Polygon, Sector, round, Angle, Rectangle, numberFormat, Random} from '@mathigon/fermat';
import {$N, slide, animate, Draggable, InputView, hover, CanvasView, ElementView, SVGView, SVGParentView} from '@mathigon/boost';
import {Burst} from '../shared/components/burst';
import {ConicSection} from '../shared/components/conic-section';
import {rotateDisk} from '../shared/components/disk';
import {Solid} from '../shared/components/solid';
import {loadD3} from './components/d3-geo';
import {EquationSystem, Geopad, Gesture, PlayBtn, Select, Slider, Step} from '../shared/types';


import './components/abacus';
import './components/grouping-dots';
import './components/subitizing';

import './components/fractions'
import { AbacusComponent } from './components/abacus';
import { GroupingComponent } from './components/grouping-dots';

// import { Abacus } from './components/abacus';

////////////////////   Testing    //////////////////////
export function testingGround($step: Step){

    const abacusComponent = $step.childNodes.find(child=>child.constructor.name === 'AbacusComponent') as AbacusComponent
    const groupingComponent = $step.childNodes.find(child=>child.constructor.name === 'GroupingComponent') as GroupingComponent
    let groupingStarted = false

    // On changing base or value
    $step.model.watch(($s: any)=>{
        const base = $step.model.base
        const n = $step.model.n
        if (abacusComponent){
            abacusComponent.abacus.base = base
            abacusComponent.abacus.value = n
            abacusComponent.abacus.restart()
        }
        if (groupingComponent){
            groupingComponent.controller.numBalls = n
            groupingComponent.controller.base = base
            groupingComponent.controller.restart()
            groupingStarted = false
        }

    })

    // Grouping Dots
    groupingComponent.childNodes[0].on('mouseup', ()=>{
        if (!groupingStarted){
            console.log("Clicked me!")
            groupingComponent.controller?.start(0)
            groupingStarted = true
        }
    })

    // Set the step's model value after interacting with the abacus
    // setTimeout temp hack to ensure step update happens after abacus update
    abacusComponent.childNodes[0].on('mouseup', ()=>{
        setTimeout(()=>{
            $step.model.n = abacusComponent.abacus.value
        }, 500)  
    })

    // console.log($step)
}

////////////////////   Showcase    //////////////////////
export function showcaseSubitizing($step: Step){
    console.log("Step one")
}

export function showcaseGrouping($step: Step){
    console.log("Step one")
    
}

export function showcaseAbacus($step: Step){
    console.log("Step one")
}
////////////////////   Commutative, Assosiative, Distributive    //////////////////////


////////////////////   Order of Operations    //////////////////////


////////////////////   Number Line    //////////////////////


////////////////////   Negative Numbers    //////////////////////


////////////////////   Properties of Zero    //////////////////////


////////////////////   Absolute Value    //////////////////////


////////////////////   Plave Value    //////////////////////
export function introPV($step: Step){
    $step.isShown = false
}

export function subitizing($step: Step){
    
}

export function numerals($step: Step){
    
}

export function groupings($step: Step){
    console.log($step)
}
