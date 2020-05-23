import "core-js/stable";
import "regenerator-runtime/runtime";
//import { join } from 'lodash';
//import './style.css'
//import './index.css'
//import Icon from './start.png'
import printMe from "./print";
import {cube} from "./math";

function component() {
    const element = document.createElement('div');

    element.innerHTML = cube(5555);
    element.classList.add('hello');

    //printMe();



   /* const btn = document.createElement('button');
    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;

    element.appendChild(btn);*/
    //const myIcon = new Image();
    //myIcon.src = Icon;

    //element.appendChild(myIcon);
    /*element.innerHTML = ['Hello webpack',
        '5 cubed is equal to ' + cube(5)
    ].join('\n\n');*/

    return element;
}

document.body.appendChild(component());
