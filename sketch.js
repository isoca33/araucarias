
let gralhas = []; // Armazena todas as gralhas azuis criadas
let arvores = [];
let cidadeX;
let nuvens = []; // Array para armazenar as nuvens
let lagoY; // Posição Y do lago

function setup() {
  createCanvas(800, 400);
  cidadeX = width / 2;
  lagoY = height / 2 + 50; // Posiciona o lago um pouco abaixo da linha do horizonte

  // Cria algumas nuvens iniciais
  for (let i = 0; i < 5; i++) {
    nuvens.push(new Nuvem(random(width), random(50, 150), random(50, 100)));
  }
}

function draw() {
  background(135, 206, 235); // céu

  // Desenha as nuvens
  for (let nuvem of nuvens) {
    nuvem.mover();
    nuvem.mostrar();
  }

  // Desenha o sol com raios
  desenhaSolComRaios(80, 80, 40, 15); // Posição X, Y, raio do sol, comprimento dos raios

  // Gralhas Azuis voando
  for (let i = gralhas.length - 1; i >= 0; i--) {
    gralhas[i].mover();
    gralhas[i].mostrar();

    // Remove se sair da tela
    if (gralhas[i].x > width + 50) {
      gralhas.splice(i, 1);
    }
  }

  // Campo
  noStroke();
  fill(144, 238, 144);
  rect(0, height / 2, width, height / 2);

  // Desenha o lago
  fill(0, 105, 148); // Cor azul escura para o lago
  ellipse(width * 0.25, lagoY, 150, 60); // Posição e forma do lago

  for (let i = 0; i < 5; i++) {
    fill(100);
    rect(cidadeX + i * 40, height / 2 - 100, 30, 100);
  }
  for (let i = 0; i < 5; i++) {
    let x = cidadeX + i * 40;
    let y = height / 2 - 100;
    let largura = 30;
    let altura = 100;

    // Prédio
    fill(100);
    rect(x, y, largura, altura);

    // Janelas (3 linhas, 2 colunas por prédio)
    let janelaLargura = 6;
    let janelaAltura = 10;
    let espacamentoX = 8;
    let espacamentoY = 20;

    for (let linha = 0; linha < 3; linha++) {
      for (let coluna = 0; coluna < 2; coluna++) {
        let janelaX = x + 5 + coluna * espacamentoX;
        let janelaY = y + 10 + linha * espacamentoY;
        fill(255, 255, 150); // Amarelo claro (luz)
        rect(janelaX, janelaY, janelaLargura, janelaAltura);
      }
    }
  }

  // Campo (árvores)
  for (let arvore of arvores) {
    arvore.mostrar();
  }
}

function desenhaSolComRaios(centerX, centerY, raio, comprimentoRaios) {
  fill(255, 223, 0);
  ellipse(centerX, centerY, raio * 2);

  stroke(255, 223, 0, 150); // Cor dos raios com alguma transparência
  for (let i = 0; i < 30; i++) {
    let angulo = map(i, 0, 30, 0, TWO_PI);
    let x1 = centerX + cos(angulo) * raio;
    let y1 = centerY + sin(angulo) * raio;
    let x2 = centerX + cos(angulo) * (raio + comprimentoRaios);
    let y2 = centerY + sin(angulo) * (raio + comprimentoRaios);
    line(x1, y1, x2, y2);
  }
  noStroke();
}

function mousePressed() {
  if (mouseY > height / 2 && mouseX < cidadeX) {
    arvores.push(new Arvore(mouseX, mouseY));
    gralhas.push(new GralhaAzul(0, random(50, 150))); // Cria uma gralha voando
  }
}

class Arvore {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.altura = 0;
  }

  mostrar() {
    this.altura = min(this.altura + 1, 80); // Crescimento mais alto

    // Tronco
    fill(101, 67, 33);
    rect(this.x - 2, this.y - this.altura, 4, this.altura);

    // Camadas da copa da araucária (em forma de disco)
    let numCamadas = 3;
    let camadaAltura = 15;
    let camadaLargura = [60, 45, 30]; // Tamanho das copas

    for (let i = 0; i < numCamadas; i++) {
      fill(34, 139, 34);
      ellipse(
        this.x,
        this.y - this.altura - i * camadaAltura,
        camadaLargura[i],
        15
      );
    }
  }
}

class GralhaAzul {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vel = random(2, 4);
    this.amplitudeY = random(1, 5); // Amplitude da variação vertical
    this.frequenciaY = random(0.02, 0.05); // Frequência da variação vertical
    this.offsetY = random(TWO_PI); // Deslocamento para cada gralha ter um movimento único
  }

  mover() {
    this.x += this.vel;
    // Adiciona um movimento vertical suave
    this.y += this.amplitudeY * sin(frameCount * this.frequenciaY + this.offsetY);
  }

  mostrar() {
    // Corpo
    fill(0, 102, 204); // Azul forte
    ellipse(this.x, this.y, 20, 10); // corpo
    ellipse(this.x + 10, this.y - 5, 15, 8); // cabeça

    // Asa
    fill(0, 76, 153);
    triangle(this.x - 10, this.y, this.x, this.y - 10, this.x + 5, this.y);

    // Bico
    fill(255, 153, 51);
    triangle(this.x + 17, this.y - 5, this.x + 22, this.y - 3, this.x + 17, this.y - 1);

    // Olho
    fill(255);
    ellipse(this.x + 12, this.y - 6, 3);
  }
}

class Nuvem {
  constructor(x, y, tamanho) {
    this.x = x;
    this.y = y;
    this.tamanho = tamanho;
    this.velocidade = random(0.1, 0.5);
  }

  mover() {
    this.x -= this.velocidade;
    if (this.x < -this.tamanho) {
      this.x = width + this.tamanho;
      this.y = random(50, 150);
    }
  }

  mostrar() {
    noStroke();
    fill(255);
    ellipse(this.x, this.y, this.tamanho * 0.8, this.tamanho * 0.6);
    ellipse(this.x + this.tamanho * 0.3, this.y - this.tamanho * 0.3, this.tamanho * 0.6, this.tamanho * 0.4);
    ellipse(this.x + this.tamanho * 0.3, this.y + this.tamanho * 0.2, this.tamanho * 0.5, this.tamanho * 0.3);
  }
}
