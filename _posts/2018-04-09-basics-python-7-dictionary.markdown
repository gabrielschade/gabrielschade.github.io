---
layout: post
title:  "Lição 7: Use Dicionários!"
date:   2018-03-19 00:00:00 +0000
comments: true
tags: [Python]
serie: Programe em Python!
---

Olá pessoas!

Mais um post na série para aprendizagem em Python, desta vez, vamos utilizar os dicionários!

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/Python-Intro-Serie/blob/master/07-Dicionario.py" %} 

Este post faz parte de uma série! Para visualizar a série inteira clique [aqui]({{ site.baseurl }}{% link posts-serie/programe em python!.html %})

Já estamos trabalhando com listas e laços de repetição desde a lição 4, já está na hora de criarmos mais estruturas, desta vez, vamos usar os dicionários!

Os dicionários permitem ao desenvolvedor armazenar pares de chave-valor facilmente! Na prática isso significa que conseguimos criar uma estrutura para armazenar mais de uma informação correlacionada.

Imagine que você deseja armazenar dados sobre uma pessoa. Você precisará guardar o nome, sobrenome, idade e quantas outras informações forem necessárias. É possível criar todas estas variáveis separadas? Mas é claro que sim!

O problema desta abordagem é que o seu programa não conseguiria relacionar as informações. Para o seu programa é como se aquelas variáveis fossem dados separados entre si, ou seja, sem nenhuma relação.

Se você já viu alguma vez um objeto em `JSON`, você verá que existem muitas semelhanças entre estas duas coisas, veja como um dicionário em Python se parece:

```python
pessoa = {
    "nome": "Gabriel",
    "sobrenome": "Schade",
    "idade": 27
}
```

Como dito anteriormente, um dicionário organiza as informações em pares no formato chave-valor. No exemplo acima, as chaves são: nome, sobrenome e idade e os valores respectivos são: Gabriel, Schade e 27.

No nosso caso todas as chaves são valores do tipo `string`, mas não há uma obrigatoriedade nisso (apesar de ser bastante comum) enquanto que os valores comumente variam de tipos.

Assim como nas listas, podemos alterar e obter os valores de um dicionário, mas neste caso ao invés de utilizarmos um índice, utilizamos a *chave*. Isso faz com que os dicionários sejam extremamente simples de se trabalhar, veja o código a seguir:

```python
pessoa["sobrenome"] = "Schade Cardoso"
```

Este código é bem parecido com alterar o valor de um item na lista e faz a mesma coisa, mas desta vez alterando um valor de um dicionário!

Podemos fazer o mesmo processo para obter um valor do dicionário e armazená-lo em outra variável, veja:

```python
nome_da_pessoa = pessoa["nome"]
```

Com isso conseguimos manipular as informações relacionadas em um mesmo dicionário. Podemos por exemplo, exibir no console o nome completo da pessoa:

```python
print( pessoa["nome"], pessoa["sobrenome"] )
``` 

Ao usar dicionários você precisa tomar **cuidado**, porque se a chave não existir a aplicação irá lançar um erro! Faça o teste:

```python
cpf = pessoa["cpf"]
```

Sabendo disso, existe uma outra forma no Python para obtermos um valor de um dicionário. Podemos fazer isso através da função `get`. Para esta função precisamos enviar duas informações: a chave e um valor padrão para o caso da chave não existir.

```python
cpf = pessoa.get("cpf", None)
print (cpf) # -> None
``` 

Através do `get` buscamos um valor em um dicionário de forma segura, fazendo com que a aplicação não gere erros.

Além da função `get`, também estão disponíveis as funções `keys` e `values`, elas retornam respectivamente uma lista contendo todas as chaves ou todos os valores do dicionário.

Vamos começar utilizando a função `keys`!

```python
chaves = pessoa.keys()
for chave in chaves:
    print (chave)
```
O mesmo vale para obtermos todos os valores:

```python
valores = pessoa.values()
for valor in valores:
    print (valor)
```

Podemos utilizar estas funções para escrever cada chave e seu respectivo valor, por exemplo:

```python
chaves = pessoa.keys()
for chave in chaves:
    valor = pessoa[chave]
    texto = chave + ": " + str(valor)
    print ( texto )
```
O código acima foi separado para ficar claro o passo-a-passo das instruções, mas você pode incluir todas estas instruções em apenas uma linha de código se achar mais confortável:

```python
chaves = pessoa.keys()
for chave in chaves:
    print (  chave, ":", str( pessoa[chave]) )
```

Por fim, assim como fizemos com as listas, também podemos apagar um elemento do dicionário com o comando `del`. É importante dizer que o `del` remove completamente o item chave-valor do dicionário.

```python
del pessoa["sobrenome"]

print (pessoa["sobrenome"])
```
O código acima irá gerar um erro, porque a partir do momento que o comando `del` foi aplicado à chave-valor "sobrenome", ela deixa de existir no dicionário, portanto, tome cuidado!

## Vamos Praticar!

* Faça um programa que crie um dicionário para definir um produto, contendo sua descrição e seu preço.

* Faça um programa que inicialize uma lista de compras com 5 itens diferentes, onde cada item é um dicionário contendo a descrição e preço do produto. Depois disso, percorra a lista e exiba as informações de cada item.

* Utilize a lista de compras do programa anterior para identificar qual o produto mais barato e qual o produto mais caro da lista de compras.

* Faça um programa que tenha uma lista com 5 de pessoas, onde cada pessoa tem seu nome e sobrenome armazenado em um dicionário, depois disso, exiba todos os nomes e sobrenomes. Para complicar um pouco as coisas, vamos simular que estes dados foram obtidos da web e com isso recebemos algumas inconsistências. Duas das cinco pessoas possuem o dicionário onde as chaves estão em maiúsculo e os outros três em minúsculo.

> **Atenção**
> 
> É fortemente recomendado que você tente fazer os exercícios antes de ver as respostas.
> Você pode encontrar as respostas [aqui](https://github.com/gabrielschade/Python-Intro-Serie/blob/master/07-Dicionario.py), elas estão bem no fim no arquivo.

O que achou do post? - Pratique mais até o próximo post da série!

Me conte nos comentários!

E Até mais!