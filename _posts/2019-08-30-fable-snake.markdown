---
layout: post
title:  "Criando o Jogo da Cobrinha em F# (ou será JavaScript?)"
date:   2019-08-30 00:00:00 +0000
image: https://i.imgur.com/AC4MpKw.png
comments: true
featured: false
tags: [F#, JavaScript] 
--- 
 
Olá pessoa!

Como post de volta férias resolvi trazer algo um pouco diferente. Que tal usar F# no navegador?

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/Fable-Snake/blob/master/src/App.fs" %} 

Ok, você pode ter achado que leu alguma coisa errada, mas é isso mesmo. Vamos executar F# no navegador.

Tá, eu confesso que na verdade não é **bem assim**. Vamos rodar JavaScript no navegador, mas usar uma ferramenta que nos permite escrever o código em F# e ele é transpilado para JavaScript.

Parece loucura? -Parece, mas vamos dar uma olhada.

### Fable

A ferramenta que vamos utilizar para fazer esse trabalho se chama [Fable](https://fable.io/){:target="_blank"}. Ele é um compilador que permite utilizar F# no ecossistema JavaScript.

Vale um disclaimer aqui, eu não estudei o Fable super a fundo, então posso cometer algum deslize por aqui. Essa é oficialmente a primeira prova de conceito que fiz, como achei o resultado legal, resolvi compartilhar por aqui.

Para fazer o Fable funcionar precisamos de alguns pré requisitos:

1. .NET Core SDK (para a parte de F#);
2. Node.js para executar o código JS;
3. Um gerenciador de pacotes JavaScript (eu utilizei o `npm`);
4. Ferramenta para desenvolvimento (eu fiz tudo pelo VS Code mesmo).

### Como começar?

Eu segui a dica do site oficial do Fable e criei meu projeto baseado [nesse](https://github.com/fable-compiler/fable2-samples/tree/master/browser){:target="_blank"} exemplo do GitHub.

Esse exemplo é um dos mais simples disponíveis, ele simplesmente levanta a aplicação com um mensagem. Além disso, boa parte das configurações já estão pré definidas de uma maneira utilizável para o nosso cenário.

Vamos lá! Vamos entender essa maluquice de projeto.

{% include image.html link="https://i.imgur.com/yNkOQt4.png" alt="Project" width=80 %}

A primeira coisa a notar é que temos duas pastas bem importantes aqui: `public` e `src`.

1. A pasta `public` é onde ficarão nossos recursos estáticos, nesse exemplo, apenas HTML e o arquivo de ícone;
2. A pasta `src` é onde fica o nosso código F# que será compilado para JavaScript.

Nesse caso utilizaremos apenas o arquivo `App.fs` para fins de simplificação de configurações, mas é totalmente plausível utilizarmos mais de um arquivo. Na verdade, existem alguns projetos de exemplo no Fable que são bastante sofisticados, incluindo componentes React e outras coisas de nível bastante impressionante.

Antes de conseguirmos executar o projeto precisamos configurar os pacotes (das duas linguagens).

Primeiro vamos executar um comando para instalar os pacotes npm, na raiz do projeto execute:

```
npm install
```

Depois de esperamos 328 horas até todos os pacotes do *node_modules* instalar precisamos instalar os pacotes .NET. Então navegue até o diretório `src` onde encontra-se o arquivo "App.fsproj" e execute:

```
dotnet restore
```

Yay, já podemos executar o projeto, basta executarmos o comando e a magia acontece:


```
npm start
```

{% include image.html link="https://i.imgur.com/0f6Zll0.png" alt="Projeto sample2-browser" width=80 %}

Apesar de funcionar, esse definitivamente não é um projeto legal o suficiente.

### Estudo de Caso - Jogo da Cobrinha do Nokia

Vamos fazer um exemplo sem precisarmos interagir com o HTML da página, focando apenas no F# e ver como isso executa.

Caso você não faça a menor ideia do jogo que eu estou falando, apesar de eu achar isso estranho, o jogo é esse aqui:

{% include image.html link="https://i.imgur.com/e4uzLk5.gif" alt="Projeto sample2-browser" width=80 %}

Você controla uma cobra dentro do ambiente do jogo, o desafio do jogo é guiar o personagem até as maçãs (que aparecem em locais aleatórios) e acumular pontos. Cada vez que você come uma maçã a Snake aumenta seu tamanho, dificultando cada vez a locomoção.

Existem mais de uma versão desse jogo, mas em resumão é isso. Geralmente o que pode variar é: 

1. Ter outros tipos de alimentos;
2. Poder bater nas paredes ou atravessá-las;

No nosso exemplo, vamos ter apenas a maçã como tipo de alimento e será permitido atravessar as paredes, ou seja, se você alcançar um canto da tela, irá sair do outro lado (como o Pac Man faz).

O legal disso é que temos um ambiente controlado e com regras relativamente simples.

Vamos começar!

### Modelando os tipos

Como já foi dito anteriormente, as regras do jogo são bastante simple, então não devemos ter muitos problemas em modelar o domínio.

Precisamos de alguns tipos para garantir que o jogo funcione corretamente, vamos começar com um tipo para identificar a direção em que a Snake está se movendo. 

Para isso, vamos usar um Discriminated Union:

```fsharp
type Direction =
    | Right
    | Left
    | Up
    | Down
```

Agora vamos criar um Record para identificar a posição (X e Y) de cada elemento do jogo dentro da tela:

```fsharp
type Position = { 
    X : int
    Y : int 
}
```

Até aqui, tudo foi bastante intuitivo. O próximo tipo será um Record para definir a nossa Snake. Neste caso precisamos pensar um pouco mais sobre o que vamos precisar.

A primeira coisa é a direção que a Snake está indo, isso deve ser um `label` do tipo `Direction`, criado anteriormente. Também precisaremos o comprimento da Snake, que deve ser incrementado cada vez que o jogador comer uma maçã. 

Por fim, precisamos da posição da Snake. Aqui as coisas ficam um pouquinho mais complicadas, afinal, não temos apenas uma posição, temos o corpo inteiro da Snake. Então precisaremos de uma lista de posições! 

```fsharp
type Snake = {
    Direction : Direction
    Length : int
    Trail : Position list
}
```

Agora precisamos de um Record para representar o jogo propriamente dito. Ele precisará conter:

1. A Snake;
2. A maçã;
3. A pontuação do jogador;
4. O tamanho da tela.

Não é totalmente necessário armazenarmos o tamanho da tela, mas pode ser interessante para customizações:

```fsharp
type Game = {
    Snake : Snake
    Apple : Position
    GridSize : int
    Score : int
}
```

Para finalizarmos o domínio só precisamos de mais um tipo. Este último será utilizado para representar o estado produzido pela atualização do jogo. Ou seja, cada vez que atualizarmos a posição da Snake podemos gerar um novo resultado:

1. O jogador continua vivo;
2. O jogador marcou um ponto;
3. O jogador colidiu e o jogo deve ser encerrado.

Podemos representar isso com o código abaixo:

```fsharp
type GameState =
    | Alive of Snake
    | Score of Snake
    | Dead
```

Ainda no nosso modelo vamos definir algumas configurações por padrão:

```fsharp
let defaultHead = { X = 10 ; Y = 10 }
let defaultGridSize = 20
```

Com isso temos o tamanho padrão da tela e a posição inicial do jogador. Agora já podemos partir para as funções que realizam os comportamentos do jogo.

### Implementando os comportamentos

A primeira função é talvez também a mais simples de todas, vamos implementar uma forma de acessar rapidamente a cabeça da Snake, que sempre será a última posição do label `Trail`. Conforme código a seguir:

```fsharp
let getHead snake = 
    snake.Trail.[snake.Trail.Length - 1]
```

A próxima função é para sortearmos a posição de maçã, novamente bastante simples. Basta utilizarmos o objeto `Random` para sortearmos um valor entre 0 e o tamanho máximo da tela:

```fsharp
let getApple() =
    let randomizer = Random()
    { 
        X = randomizer.Next(0, defaultGridSize)
        Y = randomizer.Next(0, defaultGridSize)
    }
```

Outra coisa que precisaremos com certeza é detectar se há colisão entre duas posições distintas, vamos fazer uma função para isso, simplesmente comparando se as coordenadas X e Y de duas posições distintas são iguais:

```fsharp
let checkColisionBetween positionA positionB =
    positionA.X = positionB.X 
    && positionA.Y = positionB.Y
```

Feito!

Nesse ponto as coisas complicam um pouco, mas não vai ser nada demais. Vamos implementar a função que checa a posição para qual a Snake deve se mover e ajusta as posições para "atravessar a parede" conforme imagem abaixo:

{% include image.html link="https://imgur.com/I75tUtu.png" alt="Atravessando a parede" width=80 %}

Para fazer esse comportamento, vamos receber as posições X e Y destinos e corrigí-las caso necessário, um pattern matching é capaz de resolver isso, conforme código:

```fsharp
let checkOutOfBounds newX newY =
    match (newX, newY) with
    | (x,y) when x < 0 -> defaultGridSize-1, y
    | (x,y) when y < 0 -> x, defaultGridSize-1
    | (x,y) when x > defaultGridSize-1 -> 0, y
    | (x,y) when y > defaultGridSize-1 -> x, 0
    | (x,y) -> (x,y)
```
Agora vamos implementar o método que identifica essa posição destino da Snake, para isso precisaremos checar a direção atual da Snake. 

Isso indica se devemos incrementar ou decrementar a posição da cabeça da Snake. Depois disso, não podemos nos esquecer de corrigir a posição para atravessar a parede quando necessário.

```fsharp
let getNextPosition snake =
    let (changeX, changeY) = 
        match snake.Direction with
        | Direction.Right -> (1,  0)
        | Direction.Left ->  (-1, 0)
        | Direction.Up ->    (0, -1)
        | Direction.Down ->  (0,  1) 

    let head = 
        getHead snake

    let (newX, newY) = 
        checkOutOfBounds (head.X + changeX) (head.Y + changeY)

    { X = newX ; Y = newY }
```

Como já sabemos a próxima posição da Snake está na hora de fazermos o método que a move de fato. Este método recebe por parâmetro a Snake e a posição para qual ela deve se mover. Além disso, não podemos esquecer de elimiar os elementos da lista que representa o corpo Snake que extrapolam o tamanho máximo.

Por exemplo, vamos imaginar que o tamanho máximo da Snake é 5, não podemos em nenhuma circustância ter mais elementos que isso na lista. Para evitar isso, basta removermos os elementos mais antigos.

Então os passos para realizar a movimentação são: 

1. Adicionar a posição destino como uma posição do corpo da Snake;
2. Remover os elementos extras;
3. Retornar uma Snake com a lista transformada.

```fsharp
    let move snake toPosition =
        let skipSize = 
            Math.Max(0, snake.Trail.Length + 1 - snake.Length)

        { snake with 
            Trail = snake.Trail @ [toPosition]
                    |> List.skip skipSize    
        }
```

Acredito que a próxima função seja a função mais complexa do jogo inteiro, mas calma, é só um jogo de Snake, então ainda é simples.

Vamos fazer a função que detecta as possíveis colisões e retorna um dos possíveis `GameStates` do jogo. Essa função recebe por parâmetro a maçã e a Snake:

```fsharp
let checkColisions apple snake  =
    //...
```

A primeira coisa que vamos fazer é comparar se o jogador marcou um ponto, ou seja, se a cabeça da Snake está colidindo com a maçã. 

Caso esteja, já podemos retornar o estado atual do jogo como `Score`. Caso contrário, teremos que verificar se há alguma colisão entre a cabeça da Snake e seu próprio corpo (Caso você não queira fazer com que a Snake atravesse paredes, também seria aqui que a validação das paredes seria incluída).

```fsharp
let checkColisions apple snake  =
    let checkBodyColision head trailPositions =
        //...

    let head = getHead snake
        if checkColisionBetween head apple
            then Score snake
            else checkBodyColision head snake.Trail
```
A função interna `checkBodyColision` deve checar cada uma das posições da lista da Snake. Como você já deve saber, no paradigma funcional normalmente percorremos coleções através de uma função recursiva e não será diferente aqui.

A função recursiva consiste basicamente de um pattern matching que separa o primeiro elemento do resto da lista, fazendo a comparação um a um.

Para este caso, teremos 3 casos bases e um caso onde iremos decompor o problema e realizar a função recursiva propriamente dita.

1. Caso a lista esteja vazia `-> Alive`;
2. Caso só reste a cabeça da snake na lista `-> Alive`;
3. Caso ainda estejamos percorrendo a lista e as posições do corpo e da cabeça estão colidindo `-> Dead`;
4. Caso ainda estejamos percorrendo a lista e as posições não colidem `-> chamada recursiva`.

Conforme código:

```fsharp
let checkColisions apple snake  =
    let rec checkBodyColision head trailPositions =
        match trailPositions with
        | [] -> Alive snake
        | current :: [] -> Alive snake
        | current :: tail when (checkColisionBetween head current) -> Dead
        | current :: tail -> checkBodyColision head tail

    let head = getHead snake
    if checkColisionBetween head apple
        then Score snake
        else checkBodyColision head snake.Trail
```

Agora vamos implementar duas funções diretamente relacionadas com a atualização do jogo ao decorrer um tempo, uma delas será utilizada para alterar a direção da Snake quando o jogo continua executando:

```fsharp
let continueGame game snake direction =
    {game with Snake = {snake with Direction = direction}}
```

E a outra deve executar as atualizações quando o jogador marcar um ponto. Isso inclui também atualizar a direção da Snake, mas além disso, a posição da maçã precisa ser sorteada novamente, a pontuação deve ser aumentada e o tamanho da Snake incrementado:

```fsharp
let score game snake direction =
    {game with 
            Snake = {snake with Direction = direction ; Length = snake.Length + 1}
            Score = game.Score + 1
            Apple = getApple()
    }
```

Por fim, teremos a última função de comportamento do jogo, que basicamente consiste em chamar as funções principais já criadas. 

Esta função deve receber um `Game` e retornar um `GameState`, conforme código:

```fsharp
let run game =
    game.Snake
    |> getNextPosition
    |> move game.Snake
    |> checkColisions game.Apple
```

Todos os comportamentos necessários para fazer o jogo executar corretamente já estão criados, mas ainda precisamos da interface!

#### Implementando a interface

A primeira parte do código é simplesmente estabelecer a conexão com o navegador através dos objetos fornecidos nos módulos do Fable.

Com eles podemos acessar uma representação do DOM e acessar o elemento de maneira bastante similar ao que fazemos com JavaScript, veja:

```fsharp
open Fable.Core.JsInterop
open Fable.Import
open Browser.Types
open SnakeGame

let window = Browser.Dom.window
let document = Browser.Dom.document

let mutable myCanvas : Browser.Types.HTMLCanvasElement = 
    unbox window.document.getElementById "myCanvas"
``` 

Depois disso, vamos inicializar alguns valores e variáveis para definirmos parâmetros de interface para o jogo e para interagirmos com o contexto de nosso canvas HTML:

```fsharp
let context = myCanvas.getContext_2d()

let defaultTileSize = myCanvas.width / (defaultGridSize |> float)
let mutable direction = Direction.Right
let defaultGameSettings = {
    Apple = getApple()
    Score = 0
    GridSize = defaultGridSize
    Snake = {
        Trail = [ defaultHead ]
        Direction = Direction.Right
        Length = 5
    }
}
```
O valor `context` é simplesmente utilizado para interagir com o canvas, assim como fazemos em JavaScript. Os valores `defaultTileSize` e `defaultGameSettings` serão utilizados para inicializar o jogo e imprimir a interface corretamente.

A variável `direction` é a varíavel que será alterada pelo jogador nos eventos de teclado, isso influenciará na direção da Snake dentro do jogo.

Falando nisso, vamos implementar a função que realiza a captura do evento de teclado e altera esse valor. 

Vale lembrar que o objeto de evento utilizado aqui, possuirá a propriedade `keyCode` assim como no JavaScript (inclusive com os mesmos códigos), veja:

```fsharp
let isValidChange fromDirection toDirection =
    fromDirection = Direction.Right && toDirection <> Direction.Left
    || fromDirection = Direction.Left && toDirection <> Direction.Right
    || fromDirection = Direction.Up && toDirection <> Direction.Down
    || fromDirection = Direction.Down && toDirection <> Direction.Up

let commandPressed (event:KeyboardEvent)= 
    let newDirection = 
        match event.keyCode with
        | 37.0 -> Direction.Left
        | 38.0 -> Direction.Up
        | 39.0 -> Direction.Right
        | 40.0 -> Direction.Down
        | _ -> direction
        
    if isValidChange direction newDirection
        then direction <- newDirection
    ()
```
Note também que implementamos uma pequena função para validar se podemos realizar a troca de direção.

Agora vamos fazer a função que converte uma posição X, Y de nosso jogo em uma posição no X,Y Canvas. Precisamos fazer uma conversão porque o tamanho de cada ponto na tela pode alterar de acordo com o Canvas no HTML e com o nosso `GridSize` definido no Record `Game`.

Para isso basta multiplicarmos a posição (X ou Y) pelo tamanho padrão de cada tile que calculamos anteriormente:

```fsharp
let getCanvasPosition position =
    position
    |> float
    |> (*) defaultTileSize
```

Estamos quase lá!

Faltam apenas 3 funções: desenhar o canvas, resetar o jogo quando o jogador perde e a função principal.

Vamos fazer a função para desenhar o canvas, ela deve receber o `Game` e desenhar todos os elementos, se você já está acostumado com o Canvas, verá que é basicamente a mesma coisa com a sintaxe do F#.

Pintaremos o fundo de preto (`"black"`) a Snake de verde claro (`"lime"`) e a maçã de vermelho (`"red"`), conforme código abaixo:

```fsharp
let printCanvas game = 
    context.fillStyle <- !^ "black"
    context.fillRect (0., 0., myCanvas.width, myCanvas.height)

    context.fillStyle <- !^ "lime"
    for position in game.Snake.Trail do
        context.fillRect (  position.X |> getCanvasPosition, 
                            position.Y |> getCanvasPosition, 
                            defaultTileSize - 2., defaultTileSize - 2.)

    context.fillStyle <- !^ "red"
    context.fillRect (  game.Apple.X |> getCanvasPosition, 
                        game.Apple.Y |> getCanvasPosition, 
                        defaultTileSize - 2., defaultTileSize - 2.)
```

Agora implementaremos a função de reiniciar o jogo, ela é bastante simples. Vamos apenas exibir um `alert` com a pontuação do jogador, depois disso, reiniciaremos a direção e as configurações do jogo.

```fsharp
let resetGame score =
    window.alert(sprintf "Score: %i" score) 
    direction <- Direction.Right
    defaultGameSettings
```

Agora sim, a função principal do jogo! Essa é a função que deverá ser chamada a cada atualização de tela.

Basicamente o que esta função irá fazer é: 

1. Desenhar o canvas; 
2. Executar a lógica principal do jogo (função `run`); 
3. Criar um novo Record com a versão atualizada do jogo baseada no resultado do passo anterior.

Para o terceiro passo, basta usarmos as funções já criadas anteriormente!

Vamos lá:

```fsharp
let rec snakeGame game = 
    printCanvas game
    let state = run game
    let updatedGame = 
        match state with
        | Dead -> resetGame game.Score
        | Alive snake -> continueGame game direction
        | Score snake -> score game direction
```

Agora precisamos realizar a chamada recursiva, mas nesse caso, não vamos simplesmente chamar a função. Isso faria com que a atualização de tela fosse rápida demais ficando quase impossível jogar.

Vamos manter o FPS perto de 60, então faremos uma chamada recursiva em um intervalo de tempo de 1000/15:

```fsharp
let rec snakeGame game = 
    printCanvas game
    let state = run game
    let updatedGame = 
        match state with
        | Alive snake -> continueGame game snake direction
        | Score snake -> score game snake direction
        | Dead -> resetGame game.Score

    window.setTimeout( (fun args -> snakeGame updatedGame), 1000/15) 
    |> ignore
```

Por fim, vamos fazer o `binding` do evento de teclado e iniciar o jogo:

```fsharp
document.addEventListener("keydown", fun event -> commandPressed(event :?> _))
snakeGame defaultGameSettings |> ignore
```

Você pode conferir o resultado do jogo abaixo!

{% include embedded.html width=800 height=450 url="https://gabrielschade.github.io/posts-embedded/fable-snake" %}

Bom, o post de hoje era isso!

Espero que tenham gostado, qualquer dúvida, correção ou sugestão, deixem nos comentários!

E até mais.