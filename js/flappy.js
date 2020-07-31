function novoElemento(tagName, className) {

    const elem = document.createElement(tagName)
    elem.className = className
    return elem

}


function Barreira(reverse = false) {

//          VARIAVEIS

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')

//          ATRIBUTOS

    this.elemento = novoElemento('div', 'barreira')
    this.elemento.appendChild(reverse ? corpo : borda) // reverse é quando ta pro alto
    this.elemento.appendChild(reverse ? borda : corpo)

//          METODOS

    this.setAltura = altura => corpo.style.height = `${altura}px`
    

}

function parDeBarreiras(altura, abertura, x) {

//    const define elementos privados dentro de metodos


//      ATRIBUTOS

    this.elemento = novoElemento('div', 'par-de-barreiras')
    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)
    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

//      METODOS
    
    this.sortearAbertura =  () =>  {
        
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
        
    }

    this.getX = () => this.elemento.style.left.split('px')[0]
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth
    

    this.sortearAbertura()
    this.setX(x)

}

function Barreiras(altura, deslocamento, abertura, espaco, notificarPonto) {
    this.pares = [
        new parDeBarreiras(altura, abertura, deslocamento), 
        new parDeBarreiras(altura, abertura, deslocamento + espaco ),
        new parDeBarreiras(altura, abertura, deslocamento + espaco * 2),
        new parDeBarreiras(altura, abertura, deslocamento + espaco * 3),   
    ]

    const velocidade = 5 // Andar mais rapido ou mais lento

    this.animar = () => {
        this.pares.forEach((par) => {
            
            par.setX(par.getX() - velocidade)
        
            if (par.getX() < -par.getLargura()) {
                par.setX(espaco * 4)
                par.sortearAbertura()
            }
        
        //          SIGNIFICA QUE ELE ACABOU DE CRUZAR O MEIO

            const cruzouMeio = par.getX() == 600 
        
        //          SE FOR VERDADEIRO, ELE EXECUTA A SEGUNDA PARTE, SENÃO ELE NÃO EXECUTA
        
            if (cruzouMeio)  {
                notificarPonto()
            } 
        })
    }
}


function Passaro(alturaJogo) {
    
    let voando = false
    
    this.elemento = novoElemento('img', 'passaro')
    
    this.elemento.src = 'imgs/passaro.png'
    
    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])

    this.setY = y => this.elemento.style.bottom = `${y}px`
    
    window.onkeydown = (e) => {
        document.getElementById('player').play()
        voando = true  
    }

    window.onkeyup =   (e) => voando = false
    
    window.ontouchstart = (e) =>  {
        document.getElementById('player').play()
        voando = true  
    }
    
    window.ontouchend = (e) => voando = false
    
    this.animar = () => {
        
        const novoY = this.getY() + (voando ? 8 : -6)
        
        const alturaMaxima = alturaJogo  - this.elemento.clientHeight
        
        if (novoY <= 0) {
            this.setY(0)
        }
        else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        }
        else {
            this.setY(novoY)
        }

    }

    this.setY(alturaJogo / 2)
}

function Progresso() {
    this.pontos = 1
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = () => this.elemento.innerHTML = this.pontos++
}

function estaoSobrepostos(elementoA, elementoB) {    
    const a = elementoA.getBoundingClientRect()
    
    const b = elementoB.getBoundingClientRect()
    
    const horizontal = a.left + a.width >= b.left 
        && b.left + b.width >= a.left
    
    const vertical = a.top + a.height >= b.top 
        && b.top + b.height >= a.top
    
    return horizontal && vertical
}

function colidiu(passaro, barreiras) {
    let resultado = false

    barreiras.pares.forEach(par => {    
        if (!resultado) {
            const superior = par.superior.elemento
            const inferior = par.inferior.elemento
            resultado = estaoSobrepostos(passaro.elemento, superior) || estaoSobrepostos(passaro.elemento, inferior)
        }
    })

    return resultado
}

function FlappyBird() {
    let pontos = 0
    const areaDoJogo = document.querySelector('[wm-flappy]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth
    const progresso = new Progresso() 
    const barreiras = new Barreiras(altura, largura, 300, 600, progresso.atualizarPontos)
    const passaro = new Passaro(altura)
    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(p => areaDoJogo.appendChild(p.elemento))
    this.start = () => {
        
        // loop do jogo
        const temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()
            if (colidiu(passaro, barreiras)) {
                clearInterval(temporizador)
            }
        }, 10) 
    }
}

new FlappyBird().start()


