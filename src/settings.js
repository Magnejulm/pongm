const inputs = document.querySelectorAll('input[type="number"]')
const hideButtons = document.querySelector('.buttons-hide')
const hbChild = hideButtons.children[1]
const maxNum = 9

Array.from(inputs).forEach((el) => {
    el.addEventListener('input', function(){
        if(this.value > maxNum) this.value = maxNum
        else if(this.value < 1) this.value = 1
    })
})

const colorButton = document.querySelector('.color')
const colorValue = colorButton.children[1]
const colors = ['Blue', 'White']
const rgbColors = ['220, 220, 220', '3, 66, 123']
let actColor = 0
colorButton.addEventListener('click', function(){
    actColor++

    if(actColor >= colors.length) actColor = 0

    colorValue.textContent = colors[actColor]

    root.style.setProperty('--main-color', 'rgb('+rgbColors[actColor]+')')
    root.style.setProperty('--keys-color', 'rgb('+rgbColors[actColor]+')')
    actColor == 0 ? root.style.setProperty('--bg-color', 'rgb('+rgbColors[1]+')') : root.style.setProperty('--bg-color', 'rgb('+rgbColors[0]+')')
})

hideButtons.addEventListener('click', function(){
    hbChild.textContent == 'Off' ? hbChild.textContent = 'On' : hbChild.textContent = 'Off'
})