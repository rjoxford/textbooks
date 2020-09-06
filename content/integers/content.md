# Integers


## Component Testing

> section: testing-ground
> id: testing-ground

Here is a random arrangement of dots to count. In our normal base 10 number system, we would say that there are ${n}{n|132|0,2999,29} dots. But what might this number look like if we counted in a different base? 

Let's use a base of ${base}{base|7|2,12,1}. This time, we group in ${base}s.
    
    x-grouping(n=n, base=base, width=780, height=600)

Let's display this amount, ${n}{n|132|0,99999,129}, on the abacus. 

    x-abacus(base=base, width=600, height=460, n=n)



--------------------------------------------------------------------------------

## Showcase

> section: showcase
### Subitizing Component
> id: showcase-subitizing

    x-subitizing

### Grouping Component
> id: showcase-grouping

    x-grouping-dots

### Abacus Component
> id: showcase-abacus

    x-abacus

--------------------------------------------------------------------------------


## Introduction

> section: commutative-associative-distributive
> id: intro1


--------------------------------------------------------------------------------


## Commutative, Associative and Distributive Law

> section: commutative-associative-distributive
> id: intro2

### Commutative Law
Some operations can be performed 
* 3 + 4 = 7
* 4 + 3 = 7 
* Diagrams to show

* Summary Table - 4 operations with equations filled 

Beyond Addition and Multiplication

### Associative Law
* 

### Distributive Law




--------------------------------------------------------------------------------


## Order of Operations

> section: order-operations
> id: intro3

* Why is order important?

* Sequencing of operations through a complex calculation

* Ways of remembering - PEMDAS, BODMAS, BIDMAS

--------------------------------------------------------------------------------



## The Number Line

> section: number-line
> id: intro4

---

--------------------------------------------------------------------------------



## Arithmetic with Negative Numbers

> section: arithmetic-negative-numbers-operations
> id: intro5

* symmetry in number line



--------------------------------------------------------------------------------



## Properties of Zero

> section: properties-of-zero
> id: props

* Addition and subtraction

* Multiplication

* Division

--------------------------------------------------------------------------------



## Absolute Value
> section: absolute-value
> id: abs

* reference to number line
* distance from number line
* notation, aliases

--------------------------------------------------------------------------------

## Place Value


> section: place-value
> id: intro-p-v

::: column.grow

A popular game around the world invites a player to guess the number of marbles in a jar. 
The game is difficult for a number of reasons:
*	there are lots of marbles!
*	most of the marbles are hidden behind other marbles. 
*	the jar is sealed and moving the marbles about to help us count is out of the question.
We can form an estimate of the amount of marbles, or describe a range that the number is within,
but we cannot confidently and exactly describe this amount with number.


::: column(width=320)

    x-img(src="images/marbles.png" width=320 height=272)

:::

---

> id: subitizing
> goals: 

### Subitizing

Let’s now imagine that there are very few marbles in the jar, and that we can see them
 clearly. When there are very few of something, we recognise the amount in a fraction of
  a second, before we even have a chance to begin counting. This process is called subitizing. Studies have shown that humans are able to subitize correctly and consistently up to only about 4 units. 

    x-subitizing

Beyond this, more time is needed, and errors begin to occur. Most humans are
 unable to subitize beyond a limit of around 6 – 9 units.

Its not just humans that subitize. Lots of animals have been shown to subitize, and some
 are better than us!


---

> id: numerals1
> goals: 

### Numerals

Our ability to subitize helped to form some of the early symbols used to describe numbers.
Ancient cultures all around the world had very similar ways of writing the first few numbers.
Beyond the first few, however, the symbols used start to become very different across different 
cultures:

    x-gallery(slide-width="300")
      div
        x-img(src="images/maya.svg" width=260 height=260 lightbox)
        p.caption Maya numerals, Maya Empire 250-900CE
      div
        x-img(src="images/roman.jpg" width=260 height=260 lightbox)
        p.caption Roman numerals
      div
        x-img(src="images/chinese.png" width=260 height=260 lightbox)
        p.caption Early Chinese numerals, (date)
      

---
> id: numerals2
> goals: 

Lots of dots take a long time to draw, and subitizing becomes impossible. Moving forwards, 
we will use symbols to represent the amount of pebbles.
How many different symbols should we use?  
* If we choose too few different symbols, we’ll have to use these symbols lots of times. Very big numbers would be very long strings of the same symbols.

* If we choose too many symbols, we’ll have to learn and be able to recognise lots of 
different symbols.

We have ten fingers across both of our hands, so this would seem like a natural choice for 
counting. Ten also happens to be in the goldilocks range: it is not too few yet not too many. 
We will use the following symbols - they may look familiar!

---
id: grouping

### Grouping in tens
The symbols we have chosen allow us to count up to having nine pebbles. But what do we do next?
We now form one group of ten pebbles. When we get to ten of these groups, we can form another group, this time made up of ten groups of ten, or rather one group of a hundred. When we get to ten hundreds, we group these as a thousand. This process carries on indefinitely.

    x-img(src="images/grouping.gif" width=640 height=400)
    x-grouping(width=600, height=500, n=127)

We call this a base ten numeral system because we chose ten different symbols, and always count in groups of ten. Another name for this is the decimal system. Later, you'll see how decimal places continue this same pattern into fractions.

---
> id: abacus
> goals: 

### The Abacus

The abacus is a tool for working with numbers grouped in this way. Although it’s precise origins are unknown, it is thought to have first been used by the Sumerians (modern Iraq) around 2500 BC, before spreading East and West along the trade routes of the times.

    x-img(src="images/abacus1.png" width=640 height=600)

    figure: x-abacus

As we write a number, the position of each figure shows its place value. For example, consider the number 314. The 4 represents four units. To the left of this is 1, which represents one ten. Left of this again is 3, which represents three hundreds. Applying this for the number 142 857:

    x-img(src="images/groupings-tens.png" width=640 height=200)

When we multiply a number by ten (our base), any units become tens, any tens become hundreds, hundreds become thousands, and so on. Multiplying by 10 is thus a very easy calculation, as is multiplying by a hundred (multiplying by 10 twice), or even multiplying by a thousand (multiplying by 10 three times). Conversely, dividing by ten is also very simple.
    
`348*10=3480`

`5600/100=56`


### Writing large numbers

When we write very large numbers, we write them in such a way we can easily read the place value of each figure. You may have noticed gaps in the abacus, and gaps or commas in written large numbers. For example, in the number 125 346 789 we can easily see that the 3 is in the hundreds of thousands position, and so represents 300 000


    x-img(src="images/world-numeric-styles.png" width=640 height=500)

---
> id: groupings
> goals: 

### Do we always have to group in tens?

Numeral systems with bases other than ten exist and are commonly used. The abacus below shows a base 
${a}{a|10|2,12,1} number ${a} system.

    x-img(src="images/abacus-quinary.png" width=640 height=500)


It is even possible to have number systems that use different groupings at different place values. Some familiar examples of this include:
* time (where 60 second make one minute, 60 minutes make one hour, 24 hours make one day, 7 days make 1 week)
* measures (16 ounces in one pound, 14 pounds in one stone etc.)