---
layout: post
title:  "Azure Notebooks"
date:   2019-02-12 00:00:00 +0000
comments: true
tags: [IA, Python, F#]
---

Olá pessoa!

Um dos lançamentos recentes da Microsoft é o Azure Notebooks, já ouviu falar? -Vamos olhar um pouco mais de perto como esse cara funciona!

<!--more-->

Se você já mexeu com inteligência artificial, data science ou algum tipo de experimento com dados, é muito possível que você conheça o [Jupyter Notebooks](https://jupyter.org/).

Trata-se de um projeto open-source que permite criar o que chamamos de Notebook. Ok, mas o que significa isso?

Na prática um notebook é uma uma ferramenta em que você pode colocar: anotações, gráficos e até código. Essa é a parte mais legal, o notebook possui um kernel para **executar** seu código.

Com isso é possível ter no mesmo lugar, uma explicação com texto e imagens, utilizando Markdown, código executável e até *plotar* gráficos.

E o que o Azure Notebooks tem a ver com o Jupyter? -Tudo.

O Azure Notebooks é um serviço gratuito que incorpora o Jupyter e permite realizar tudo através do navegador. Além disso, no caso do Azure Notebooks é possível utilizar F# (❤) como linguagem para seu notebook.

Vamos dar uma olhada nele?

Primeiro acesse: [https://notebooks.azure.com/](https://notebooks.azure.com/)

{% include image.html link="https://imgur.com/yWsYKKX.png" alt="Azure Notebooks" width=75 %}

Depois de criar a conta e nos autenticarmos é possível acessar _"My Projects"_, que permite visualizar e criar novos projetos, vamos fazer um!

{% include image.html link="https://imgur.com/GUk8oIK.png" alt="Azure Notebooks - My Projects" width=75 %}

É possível criar seu projeto a partir de um repositório no GitHub ou criá-lo em branco. Para este post vamos seguir criando do zero, quem sabe a importação do GitHub fique para um post futuro.

Ao pressionar o botão _"New Project"_ nos deparamos com uma janela simples, onde precisamos informar o nome do projeto, indicar se ele é público ou privado e se conterá um arquivo README.

Tudo muito semelhante a um repositório do GitHub, certo?

Depois de criarmos nosso projeto, é possível incorporar múltiplos arquivos nele:

{% include image.html link="https://imgur.com/7YPMs8V.png" alt="Azure Notebooks - Project" width=75 %}

Você também pode notar os botões: _Clone_ e _Star_, novamente, assim como um repositório do GitHub. O botão _"+"_ é onde iremos adicionar coisas ao nosso projeto. Ele trás quatro opções básicas: Notebook, Folder, Blank File e Markdown.

Vamos criar nosso Notebook!

{% include image.html link="https://imgur.com/gqHvSfS.png" alt="Azure Notebooks - First Notebook" width=75 %}

Assim que o criamos, ele ficará disponível na lista de arquivos, vamos entrar e ver como isso funciona.

{% include image.html link="https://imgur.com/hIMK36c.png" alt="Azure Notebooks - Notebook" width=75 %}

Se você já utilizou o Jupyter, verá que é praticamente a mesma coisa, caso contrário, vamos ao básico!

A primeira coisa importante é entender as divisões do Notebook, ele funciona basicamente através de células. Cada célula contém um tipo, como _code_ ou _markdown_, por exemplo.    

Além das células, temos a caixa de ferramentas, que permite realizar as operações comuns, como adicionar uma célula, alterar o tipo dela, executar a célula selecionada e abrir a lista de comandos.

O tipo indicado na barra de ferramentas sempre está relacionado à célula selecionada atualmente, veja:

{% include image.html link="https://imgur.com/JWGOPBy.png" alt="Azure Notebooks - Cell" width=75 %}

Vamos alterar o tipo para Markdown e criar um cabeçalho:

{% include image.html link="https://imgur.com/ZHMVncs.png" alt="Azure Notebooks - Header" width=75 %}

Veja que ele ainda não se parece com um cabeçalho, mas sim, com o markdown cru. Isso porque ainda não executamos esta célula, basta clicar em _"Run"_ para ver o resultado.

A partir daqui você pode incluir suas células e executar o código Python que desejar!

Vamos fazer um exemplo com algo que gere um resultado visual. Para isso, vamos utilizar a `pandas` e a `numpy`. Então, vamos começar com as importações:

{% include image.html link="https://imgur.com/D4nZ1c8.png" alt="Azure Notebooks - Imports" width=75 %}

Neste momento podemos notar dois comportamentos no Notebook:

1. O asterisco ao lado da célula;
2. A mudança na cor do ícone do Kernel;

As duas coisas estão relacionadas ao processamento que está sendo executado. O asterisco indica que a célula está sendo processada e o ícone do Kernel indica que ele está "trabalhando".

Até aqui, tudo tranquilo, certo?

Agora vamos gerar um DataFrame com a `pandas`! Ou seja, vamos criar uma nova célula abaixo, e utilizá-la como se estivéssemos em um código Python normal. Aliás, esteja a vontade para incluir uma breve descrição também.

Vamos gerar o DataFrame com números sequenciais de 1 até 6, separando-os em três colunas (Primeira, Segunda e Terceira) e duas linhas:

```python
matriz = pandas.DataFrame(numpy.array([ [1,2,3], [4,5,6] ], dtype=int), columns=["Primeira", "Segunda", "Terceira"])

```
Ao fazer isso e executar a célula, não veremos nenhum resultado.

No entanto, se incluirmos uma linha abaixo obtendo o valor da variável `matriz`, podemos visualizar o DataFrame:

{% include image.html link="https://imgur.com/f3SRPDH.png" alt="Azure Notebooks - DataFrame" width=75 %}

Legal né?

Por fim, vamos gerar um gráfico utilizando a função `.plot.bar()` do DataFrame:

```python
matriz.plot.bar()
```

E o resultado pode ser conferido abaixo:

{% include image.html link="https://imgur.com/TbbPb5B.png" alt="Azure Notebooks - Plot" width=75 %}

O mais legal é que temos tudo isso no mesmo lugar. 

> Você pode acessar o Notebook completo [aqui](https://notebooks.azure.com/gabriel-schade/projects/primeiro-experimento/html/MeuPrimeiroNotebook.ipynb).

Qualquer dúvida ou sugestão, deixem nos comentários!

E até mais.