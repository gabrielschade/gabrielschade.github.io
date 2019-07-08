---
layout: post
title:  "Construindo uma Queue usando JavaScript"
date:   2019-07-08 00:00:00 +0000
image: https://i.imgur.com/eTiHsXu.png
comments: true
tags: [JavaScript, Algoritmos] 
--- 
 
Olá pessoa!

Vamos continuar explorando estruturas de dados, dessa vez falaremos da Queue!

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/algorithms/blob/master/DataStructures/DataStructures.JavaScript/Queue.js" %} 

Se você não viu o post passado, recomendo acessar [este link]({{ site.baseurl }}{% link _posts/2019-06-24-algoritmos-ii.markdown %}){:target="_blank"}, afinal `Stacks` e `Queues` são bastante semelhantes.

Por conta disso, vou passar a implementação da fila (`Queue`) muito mais rápida do que a implementação

### Queue (fila)

A `Queue` ou fila é uma estrutura de dados muito semelhante à pilha, no entanto a ordem de entrada e saída dos elementos se comporta de maneira diferente. No caso da fila temos uma estrutura FIFO (First In First Out).

Entender essa ordem é muito mais simples, basta imaginarmos uma fila de atendimento, a primeira pessoa que entrou na fila (First In) deve ser necessariamente a primeira pessoa a ser atendida (First Out).

{% include image.html link="https://i.imgur.com/eTiHsXu.png" alt="Fila de Pessoas" width=80 %}

Assim como a pilha, a implementação de uma `Queue` pode ser feita de mais de uma forma. Mas sempre devem seguir essa característica e ter algumas operações básicas.

#### QueueNode

Apesar de não ser estritamente necessário, eu gosto de separar a classe que define o elemento da estrutura da dado, da estrutura em si. Então vamos começar criando o `QueueNode` para representar isso. Assim como na `Stack`, cada elemento deve apontar para o próximo elemento.

```javascript
class QueueNode{
    constructor(value){
        this._value = value;
        this._next = null;
    }

    set next(value){
        this._next = value;
    }

    get next(){
        return this._next;
    }

    get value(){
        return this._value;
    }
}
```
Essa classe é igual à classe `StackNode` do post anterior, por isso, sem mais delongas.

#### Estrutura Principal

Agora vamos criar a estrutura principal da `Queue`. Ela também será bastante semelhante à `Stack`, incluindo:

1. Um método para adicionar elemento (`enqueue`);
2. Um método para remover o **primeiro** elemento (`dequeue`);
3. Um método para visualizar o **primeiro** elemento (`peek`);
4. Uma propriedade para verificar se a fila está vazia (`empty`);
5. Uma propriedade para verificar se o tamanho da fila (`size`).

Vamos começar apenas com o construtor, seguindo a lógica de poder ser inicializado vazio ou com um valor:

```javascript
class Queue{
    constructor(value){
        this._size = 0;

        if (value === undefined){
            this._first = null;
        }
        else{
            this.enqueue(value);
        }
    }
}
```

Agora vamos fazer as propriedades para verificar o tamanho da fila e se ela está vazia:

```javascript
//...
get size(){
    return this._size;
}

get empty(){
    return this.size === 0;
}
```
Agora vamos aos três métodos principais de uma fila: `enqueue`, `dequeue` e `peek`.

#### enqueue - O(1)

O método para enfileirar um elemento é bastante simples, mas para isso, precisamos de um atributo diferente do que fizemos na `Stack`. Isso porque temos de adicionar o elemento no fim da fila.

Vamos primeiro fazer uma implementação pior, veja o código abaixo:

```javascript
enqueue(value){
    let newNode = new QueueNode(value);
    if(this.empty){
        this._first = newNode;
    }else{
        let current = this._first;
        while(current.next != null){
            current = current.next;
        }
        current.next = newNode;
    }
    this._size++;
}
```
Essa solução pode até funcionar, mas não está nem perto de ser a ótima, como você pode ter visto no título da sessão esse método deveria ter a complexidade de tempo O(1), mas não parece nada com o que estamos fazendo certo?

Pense por um momento, cada vez que enfileiramos algo, estamos percorrendo a lista inteira, o que torna a complexidade de tempo O(N).

Tente pensar um pouco em como resolver isso antes de seguirmos adiante.

Bom, o jeito mais simples de simplificarmos isso é mantermos uma propriedade apontando para o último elemento da lista, dessa forma conseguimos manter o acesso tanto ao primeiro quanto ao último em O(1).

Vamos adicionar esse valor no construtor:

```javascript
class Queue{
    constructor(value){
        //...

        if (value === undefined){
            this._first = null;
            this._last = null;
        }
        else{
            this.enqueue(value);
        }
    }
}
```
E agora basta acessarmos diretamente esse elemento no momento de enfileirar:

```javascript
enqueue(value){
    let newNode = new QueueNode(value);
    if(this.empty){
        this._first = newNode;
    }else{
        this._last.next = newNode;
    }
    this._last = newNode;
    this._size++;
}
```
Muito melhor não?

Note também que precisamos atualizar esse valor cada vez que incluirmos um novo elemento na coleção, não esqueça disso.

#### Dequeue - O(1)

O método dequeue é bastante simples, basta removermos o primeiro elemento e atualizar o atributo `_first`, bem parecido com o método `pop` de uma `Stack`:

```javascript
dequeue(){
    let itemToRemove = this._first;
    this._first = itemToRemove.next;
    this._size--;
    return itemToRemove.value;
}
```
Note que não estamos fazendo validações de null ou de tamanho de Queue, estamos somente focando na estrutura de dados em si.

#### Peek - O(1)

O método `peek` é identico ao método da `Stack`, basta retornarmos o valor armazenado em `_first`.

```Javascript
peek() {
    return this._first.value;
}
```

#### Indo Além

Assim como fizemos na `Stack`, podemos adicionar mais incrementos na estrutura se desejarmos, utilizar "pattern matching" para realizar o `dequeue` e retornar o restante simultaneamente ou poder gerar um array diretamente da `Queue` podem ser incrementos interessantes.

Vamos começar com a desconstrução:

```javascript
get headAndTail(){
    return [this.dequeue(), this];
}
```

Aqui já temos um efeito relativamente legal:

```javascript
let fila = new Queue(10);
fila.enqueue(20);
fila.enqueue(30);

let [head, tail] = fila.headAndTail;
head; //10
tail; //Queue {_size: 2, _first: QueueNode, _last: QueueNode} [20 - 30]
```

Para finalizar, podemos fazer um laço de repetição que transforma a fila em um array:

```javascript
toArray(){
    let array = [];
    while(this._size > 0){
        array.push(this.dequeue());
    }
    return array;
}
```

Bom, o post de hoje era isso!

Espero que tenham gostado, qualquer dúvida, correção ou sugestão, deixem nos comentários!

E até mais.