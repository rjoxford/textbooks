export function getOrderColor(order: number){
    // TODO - find and use defualt Mathigon colors
    switch (order) {
        case 0:     return 'purple'; break;
        case 1:     return 'blue'; break;
        case 2:     return 'green'; break;
        case 3:     return 'orange'; break;
        case 4:     return 'red'; break;
        case 5:     return 'teal'; break;
        case 6:     return 'black'; break;
        case 7:     return 'red'; break;
        case 8:     return 'red'; break;
        default: return 'red'
    }
}