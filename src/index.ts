import './styles/styles.css'; // Підключення стилів
import logo from './assets/images/logo.png'; // Імпорт зображення

function component() {
    const element = document.createElement('div');
    element.innerHTML = 'Hello Webpack';
    element.classList.add('hello');
    
    const myImage = new Image();
    myImage.src = logo;
    element.appendChild(myImage);
  
    return element;
}

document.body.appendChild(component());

type Names = 'Pet' | 'Vas' | 'Pav';
const myname: Names = "Pet";

console.log(myname);


