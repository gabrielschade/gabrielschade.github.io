---
layout: post
title:  "Estruturas de Dados com JavaScript (Stack)"
date:   2019-06-24 00:00:00 +0000
image: https://i.imgur.com/2oBwBSk.png
comments: true
tags: [JavaScript, Algoritmos] 
--- 
 
Olá pessoa!

Que tal implementarmos começarmos a implementar algumas estruturas de dados usando JavaScript?

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/algorithms/blob/master/DataStructures/DataStructures.JavaScript/Stack.js" %} 

Como mencionei no post anterior estou me aprofundando um pouco mais no JavaScript. Por conta disso, vou começar resolvendo alguns problemas básicos de programação.

Vamos começar implementando uma das estruturas de dados mais simples: a pilha.

### Stack (pilha)

A `Stack` ou pilha é uma estrutura de dados bastante rápida para adicionar ou remover elementos. No entanto ela precisa seguir uma característica bastante específica: ela é uma estrutura LIFO (Last In First Out).

Mas o que isso significa? Para exemplificar é melhor fazermos uma analogia com o mundo.
Imagine livros empilhados um sobre o outro:

{% include image.html link="https://imgur.com/xPXxjsN.png" alt="Pilha de livros" width=80 %}

O último livro colocado nessa pilha é o livro de capa verde, por isso ele está no topo. Se formos desmontar essa pilha de livros, ele seria o primeiro livro a ser pego. Ou seja, o último livro adicionado a pilha (Last In) é o primeiro a sair dela (First Out).

A implementação de uma Stack pode ser feita de mais de uma forma, então o que eu vou mostrar aqui foi a implementação que me pareceu mais agradável (pelo menos a primeira vista). Como falei anteriormente, não sou um super especialista em JavaScript, então podem ter coisas estranhas no código (caso sim, me avisem nos comentários).

#### StackNode

Vamos começar criando a classe que representa cada elemento na pilha. Essa classe será utilizada para armazenar o valor do dado e para servir como um ponteiro para o próximo elemento. Vamos chamar essa classe de `StackNode`.

```javascript
class StackNode {
    constructor(value) {
        this._value = value;
        this._next = null;
    }
}
```
Note que criamos um construtor para inicializar o valor do nodo da pilha. Agora vamos fazer duas funções: uma para obter o valor armazenado em `_value` e outra para alterarmos o valor em `_next`.

```javascript
class StackNode {
    constructor(value) {
        this._value = value;
        this._next = null;
    }

    setNext(next) {
        this._next = next;
    }

    getValue() {
        return this._value;
    }
}
```

A partir de agora, conseguimos criar elementos para nossa pilha:

```javascript
let elemento = new StackNode(10);
let segundoElemento = new StackNode(25);

let valor = elemento.getValue();
elemento.setNext(segundoElemento);
```
Apesar disso já funcionar como esperado, podemos tornar as funções para obter e alterar valores em algo similar as propriedades do C#. Para isso, basta colocar as palavras reservadas `get` ou `set` antes da função e o nome da propriedade separado por espaço:

```javascript
class StackNode {
    constructor(value) {
        this._value = value;
        this._next = null;
    }

    set next(next) {
        this._next = next;
    }

    get value() {
        return this._value;
    }
}
```

Agora quando o acesso aos valores se torna muito mais natural:

```javascript
let elemento = new StackNode(10);
let segundoElemento = new StackNode(25);

let valor = elemento.value;
elemento.next = segundoElemento;
```
Legal né?

#### Estrutura Principal

Agora vamos criar a estrutura principal da `Stack`. Vamos começar apenas com o construtor, permitiremos que a pilha seja inicializada com um valor, ou vazia. Para isso vamos precisar checar o valor recebido no construtor.

Além disso, a pilha só possui acesso ao primeiro elemento, lembra?
Comumente esse elemento é chamado de `Head`, por conta disso, teremos um atributo privado para armazenar o primeiro elemento da estrutura:

```javascript
class Stack {
    constructor(value) {
        if (value === undefined)
            this._head = null;
        else
            this._head = new StackNode(value);
    }
}
```
Agora vamos começar com o mais simples, uma propriedade para verificar se a pilha está vazia ou não, para isso, basta checar se o `head` está nulo:

```javascript
//...
get empty() {
    return this._head == null;
}
```
Agora vamos aos três métodos principais de uma pilha: `push`, `pop` e `peek`. Respectivamente eles são utilizados para: adicionar um elemento ao topo da pilha, remover o elemento do topo da pilha e verificar o valor do elemento do topo da pilha (sem removê-lo).

#### Push - O(1)

Vamos começar com o método `push`. Ele é bastante simples, basta fazermos:
1. Receber um valor por parâmetro e criar um objeto do tipo `StackNode` com este valor;
2. Atribuir o atual `head` da pilha como próximo elemento do novo `StackNode`;
3. Fazer com que a Stack aponte para o novo elemento como `head`.

```javascript
push(value) {
    let newHead = new StackNode(value);
    newHead.next = this._head;
    this._head = newHead;
}
```
Note que não estamos fazendo nenhuma verificação de valor, estamos confiando que o usuário de nossa estrutura de dados não tentará quebrá-la (não faça isso no mundo real).

Esse método possui complexidade de tempo igual à O(1), afinal, não importa o tamanho da pilha não teremos nenhum impacto nessa função.

#### Pop - O(1)

Agora vamos implementar o método `pop`, ele também é possui complexidade de tempo igual à O(1). Para implementar este método basta alterarmos a posição do `head` da pilha para próximo elemento. Não esqueça de armazenar o valor do `head` atual antes de fazer a alteração, afinal precisamos retornar ele.

```javascript
pop() {
    let valueToReturn = this._head;
    this._head = valueToReturn._next;

    return valueToReturn.value;
}
```

#### Peek - O(1)

O método `peek` é o mais simples dos três, basta retornarmos o valor armazenado na `head`.

```Javascript
peek() {
    return this._head.value;
}
```
Na verdade, este método poderia virar uma propriedade `get` para o valor do head, sem problemas:

```javascript
get head(){
    return this._head.value;
}
```
Com isso já conseguimos usar nossa pilha normalmente:

```javascript
let pilha = new Stack()
pilha.push(10);
pilha.push(12);
pilha.empty;  //false
pilha.head;   //12
pilha.pop();  //12
pilha.peek(); //10
pilha.pop();  //10
pilha.empty;  //true
```
#### Indo Além

Você pode incrementar a pilha se desejar, um exemplo disso é inserir a propriedade `size`, `length` ou `count` para sabermos quantos elementos existem na pilha. Para isso basta controlar um valor interno e alterá-lo nos métodos `pop` e `push`:

```javascript
push(value) {
    this._size = this._size +1;
    //...
}
pop(){
    this._size = this._size -1;
    //...
}

get size(){
    return this._size;
}
```
Podemos também alterar o construtor para evitar repetição de comportamento, ao invés de criarmos o elemento inicial, podemos utilizar o método `push` para adicioná-lo:

```javascript
class Stack {
    constructor(value) {
        this._size = 0;

        if (value === undefined){
            this._head = null;
        }
        else{
            this.push(value);
        }
    }
    //...
}
```
Uma outra coisa que podemos adicionar é uma propriedade para quebrar a estrutura da pilha em dois elementos: `head` e `tail`. Onde o `head` é o primeiro elemento da pilha e o `tail` é todo o restante da pilha.

Para fazer isso, podemos retornar um array com os dois elementos, veja:

```javascript
get headAndTail(){
    return [this.pop(), this];
}
```

O lado legal desta propriedade é que podemos utilizar `pattern matching` para obter o resultado, veja:

```javascript
let pilha = new Stack(10);
pilha.push(20);
pilha.push(30);

let [head, tail] = pilha.headAndTail;
head; //30
tail; //Stack {_size: 2, _head: StackNode} [20 - 10]
```
Podemos usar esse `pattern matching` para uma função recursiva, semelhante ao que fazemos no F#:

```javascript
toArrayRecursive(){
    let recursiveLoopToArray = (stack, array) => {
        if(stack.size == 0) return array;

        let [head, tail] = stack.headAndTail;
        array.push(head);
        return recursiveLoopToArray(tail, array);
    }

    return recursiveLoopToArray(this,[]);
}
```
O lado não legal desta propriedade é que estamos causando um efeito colateral na própria estrutura, então quando utilizamos o `headAndTail` estamos afetando o objeto `pilha`, ou seja, os dois são literalmente o mesmo objeto:

```javascript
let pilha = new Stack(10);
pilha.push(20);
pilha.push(30);

let [head, tail] = pilha.headAndTail;
head; //30
tail;  //Stack {_size: 2, _head: StackNode} [20 - 10]

pilha; //Stack {_size: 2, _head: StackNode} [20 - 10]
pilha === tail; //true
```
Além disso, a solução recursiva para transformar a pilha em um array funciona, mas é muito mais complexa de entender do que um simples laço de repetição para fazermos a mesma coisa:

```javascript
toArray(){
    let array = [];
    while(this._size > 0){
        array.push(this.pop());
    }
    return array;
}
```
Uma observação interessante, é que tanto o método com laço de repetição quanto o recursiva possuem complexidade O(n), afinal, eles precisam percorrer toda a coleção.

Bom, o post de hoje era isso!

Espero que tenham gostado, qualquer dúvida, correção ou sugestão, deixem nos comentários!

E até mais.