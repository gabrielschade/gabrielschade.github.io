---
layout: post
title:  "Construindo Uma Lista Encadeada (Linked List)"
date:   2019-11-13 00:00:00 +0000
image: https://imgur.com/YlBc4rg.png
comments: true
featured: false
tags: [JavaScript, Algoritmos] 
--- 
 
Olá pessoa!

Vamos continuar a série sobre estrutura de dados? -Dessa vez com listas encadeadas (ou listas ligadas).

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/algorithms/blob/master/DataStructures/DataStructures.JavaScript/LinkedList.js" %} 

Este é o terceiro post sobre estrutura de dados aqui no blog, dessa vez falaremos sobre listas encadeadas ou `Linked Lists`.

Se ainda não leu, recomendo que você também leia o post sobre [pilhas]({{ site.baseurl }}{% link _posts/2019-06-24-algoritmos-ii.markdown %}){:target="_blank"} e [filas]({{ site.baseurl }}{% link _posts/2019-07-08-algoritmos-iii %}){:target="_blank"}.

Agora vamos ao assunto do post.

#### Linked List

O conceito principal de listas encadeadas ou __linked lists__ é bastante simples, nessa estrutura de dados os elementos não são armazenados em memória contígua, assim como um array. Mas peraí, o que é uma memória contígua?

Em poucas palavras, memória contígua é um bloco de memória subsequente alocado de uma vez só. Esse é um dos motivos pelo qual normalmente precisamos explicitar o tamanho de um array para alocá-lo. O programa irá reservar um bloco contínuo de acordo com o tamanho do array.

Por que fazemos isso? A resposta simples é, porque é, de maneira geral, mais rápido. Afinal, o programa não irá precisar procurar fisicamente na memória o próximo elemento, ele está alocado fisicamente ao lado do anterior.

Maaaas, se a memória não é alocada de maneira unificada, como saberemos onde está o próximo elemento?

As listas encadeadas são baseadas em máquinas de ponteiros, de maneira MUITO resumida, isso significa que cada elemento possui o endereço da memória (_ponteiro_) para o elemento seguinte.

Se você acompanhou os posts anteriores, deve ter notado que quando criamos a `Stack` e a `Queue` já utilizamos essa abordagem, isso quer dizer que elas também eram listas encadeadas?

Não exatamente, porque possuíam comportamentos encapsulados que as definem como pilhas e filas, mas a maneira como os nós estavam organizados era exatamente igual à uma lista encadeada.

Diferente das pilhas e filas, nós podemos acessar qualquer elemento da lista encadeada, sem exceção.

#### LinkedListNode

Para esta estrutura de dados, talvez o nó seja mais importante do que a própria estrutura. Isso fica ainda mais evidente quando resolvemos exercícios sobre listas encadeadas, normalmente nos é oferecido apenas um nó, ao invés de um objeto com a lista. Isso porque através do primeiro nó, podemos percorrer a lista completa.

Vamos definir essa classe, ela é bastante simples, basta armazenarmos o valor e o ponteiro para o próximo nó.

```javascript
class LinkedListNode{
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

#### Estrutura Principal

Como mencionei antes, em vários momentos não precisamos de uma estrutura principal para trabalharmos com listas encadeadas, mas para deixar o post um pouco mais completo, vamos criá-la:

```javascript
class LinkedList{
    constructor(value) {
        this._head = null;
        this._size = 0;
        
        if (value !== undefined) {
            this.append(value);
        }
    }
}
```
Podemos dar uma pequena incrementada, fazendo com que nosso construtor também aceite um array como parâmetro:

```javascript
class LinkedList {
    constructor(value) {
        this._head = null;
        this._size = 0;
        
        if (value !== undefined) {
            if (Array.isArray(value)) {
                for(let element of value)
                    this.append(element);
            }else{
                this.append(value);
            }
        }
    }
}
```

Você já deve ter notado que estamos usando o método `append` que ainda não existe, mas não se preocupe com isso agora. Vamos só assumir que ele adiciona um elemento na última posição da lista encadeada.

Agora vamos criar as propriedades para mantermos a lista:

```javascript
get size() {
    return this._size;
}

get isEmpty() {
    return this.size === 0;
}

get head() {
    return this._head;
}

set head(value) {
    this._head = value;
}
```

As propriedades são bastante simples de entender, temos uma que define o tamanho da lista, uma para identificar se a lista está vazia ou não e a outra para identificar o primeiro elemento da lista. Só isso.

Agora vamos começar a implementar os métodos!

Vamos precisar de algumas operações nessa classe: adicionar um novo elemento em qualquer posição, remover um elemento de uma posição e claro, obter o valor de um elemento em uma posição específica.

Um ponto de atenção aqui é que tanto para adicionar um novo elemento, quanto para remover, precisaremos antes, encontrar a posição para fazer isso. Portanto, é justo começarmos a implementação pelo método de busca.

#### Get - O(n)

Esse é um ponto que define a principal diferença entre uma lista encadeada e uma lista "normal". Em uma lista normal podemos acessar o elemento em complexidade O(1), basta sabermos seu índice. No caso da lista encadeada precisamos necessariamente começar no primeiro elemento e percorrer a lista até o índice informado.

O que nos leva ao pior caso, onde percorremos a lista completa: O(n).

Nossa função de busca não irá definir comportamento nenhum, ela simplesmente vai retornar o nó atual e o nó anterior (para a operação de exclusão). 

Para fazer isso, basta utilizarmos um laço de repetição e continuarmos obtendo o próximo elemento da lista até chegarmos no índice definido:

```javascript
_getByIndex(index) {
    let previousNode = null;
    let currentNode = this.head;
    while (index > 0) {
        previousNode = currentNode;
        currentNode = currentNode.next;
        index--;
    }

    return [currentNode, previousNode];
}
```
Com este método implementado, podemos criar uma variação para retornar apenas o valor do nó informado de maneira bastante simples:

```javascript
get(index) {
    let [currentNode,_] = this._getByIndex(index);
    return currentNode.value;
}
```

Agora vamos para as operações onde a lista encadeada brilha!

#### Insert - O(1) / O(n)

Diferente de uma lista comum, na lista encadeada a operação de inserção possui complexidade constante. Isso porque em uma lista comum teríamos que copiar todos os elementos do array para o próximo índice, enquanto que na lista encadeada apenas reorganizamos os ponteiros.

Assim como fizemos no método de busca, primeiro vamos implementar um método que esconde boa parte da complexidade de inserção. Este método recebe por parâmetro o nó anterior ao nó que será adicionado e o valor do novo nó. Com isso podemos reorganizar os ponteiros e fazer com que a lista continue íntegra.

Além disso, precisamos lembrar de duas coisas: alterar o valor da propriedade `head` nos casos onde o nó anterior ao nó que será inserido seja nulo e incrementarmos a propriedade `size`:

```javascript
insert(node, value) {
    let newNode = new LinkedListNode(value);

    if (node == null) {
        newNode.next = this.head;
        this.head = newNode;
    }
    else {
        let next = node.next;
        node.next = newNode;
        node.next.next = next;
    }

    this._size = this._size + 1;
    return node;
}
```

Agora que este método está implementado precisamos implementar o `insertAt`, método que recebe o valor a ser inserido e o índice para inserção. Podemos obter o nó através da função de busca criada anteriormente:

```javascript
insertAt(value, index) {
    let [_,previous] = this._getByIndex(index);
    this._insert(previous, value);
}
```

Também podemos criar métodos para inclusão no início (`add`) e fim (`append`) da lista:

```javascript
add(value){
    this.insert(null, value);
}

append(value) {
    this.insertAt(value, this._size);
}
```

> **Importante**
>
> O método `insert` e `add` possuem complexidade O(1), o método `insertAt` e `append` possuem complexidade O(n), visto que utilizamos internamente o método de busca.
> No entanto, vale lembrar que é muito comum utilizarmos os nós diretamente, como já mencionei antes, por conta disso, a complexidade de uma lista encadeada é comumente referida como O(1), porque nos casos onde você possui o nó, ela é de fato constante.
> Isso também vale para a função de exclusão.


#### Remove - O(1) / O(n)

Para a função de exclusão, iremos implementar apenas a função baseada no índice, ela é bastante simples em termos de entendimento. Basta localizarmos o nó que desejamos excluir e o nó anterior (a função `getByIndex` já nos entrega isso) e reorganizarmos os ponteiros, veja:

```javascript
remove(index) {
    let [currentNode, previousNode] = 
        this._getByIndex(index);

    if (previousNode !== null) {
        previousNode.next = currentNode.next;
    } else {
        this._head = currentNode.next;
    }

    this._size = this._size - 1;
}
```

Com isso completamos nossas funcionalidades básicas de uma lista encadeada. No entanto ainda podemos criar interfaces para melhorar o consumo dela.

A primeira coisa é fazer ela ser iterável através do `for of` como fizemos no array no construtor, veja:

```javascript
*values() {
    let current = this.head;
    while (current !== null) {
        yield current.value;
        current = current.next;
    }
}

[Symbol.iterator]() {
    return this.values();
}
```
Agora podemos percorrer os elementos como se ela fosse um array normal:

```javascript
let linkedList = new LinkedList([10,2,3,5,0]);
for(let node of linkedList){
    console.log(node);
}

//10
//2
//3
//5
//0
```
Legal né?

Ainda podemos finalizar com o famoso `toArray`, onde simplesmente iremos percorrer os nós e inserir seus respectivos valores em um array:

```javascript
toArray(){
    let array = [];
    for(let node of this)
        array.push(node);

    return array;
}
```

Bom, o post de hoje era isso!

Espero que tenham gostado, qualquer dúvida, correção ou sugestão, deixem nos comentários!

E até mais.