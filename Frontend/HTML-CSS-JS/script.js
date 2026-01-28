console.log('Click Me !!');

function handleClick() {
    const heading = document.getElementById('heading');
    const button = document.getElementById('btn');

    heading.textContent = 'Button Clicked!';
    heading.style.color = '#28a745';
    button.textContent = 'Clicked!';

    console.log('Button was clicked!');

    setTimeout(() => {
        heading.textContent = 'HTML CSS JAVASCRIPT';
        heading.style.color = '';
        button.textContent = 'Click Me';
    }, 2000);
}
