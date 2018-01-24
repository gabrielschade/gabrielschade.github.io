---
layout: blank-layout-scroll
title: Itajaí .NET
parallax-bg: /public/img/bio-bg.jpg
parallax-text: >
     conecte-se,

     crie

     e compartilhe
     
     
---

{% include itj-net-menu.html %}

<div class="margin-side-10p">

{% include huge-h2.html content="Itajaí .NET" css="purple-itj font-64 text-left" %} 

<div class="row">
    <div class="col s4">
        <h4><i class="medium material-icons purple-itj">share</i></h4>
        <p class="light-font">O Itajaí .NET é uma organização criada com o objetivo principal de conectar pessoas da região do Vale do Itajaí para que juntos façamos a diferença.</p>
    </div>

   <div class="col s4">
        <h4><i class="medium material-icons purple-itj">code</i></h4>
        <p class="light-font">
        Em geral o maior público é ligado ao desenvolvimento na plataforma .NET, mas isso não é exclusividade. A ideia é compartilhar conhecimento em tecnologia de qualquer tipo e desta forma, todo mundo se ajuda.</p>
    </div>

   <div class="col s4">
    <h4><i class="medium material-icons purple-itj">accessibility</i></h4>
    <p class="light-font">Juntos somos <strong>mais fortes</strong>, tão simples quanto isso.</p>
   </div>

   {% include huge-h2.html content="Eventos Passados" css="purple-itj font-64 text-left" %} 
</div>

<div class="row">
    <div class="col s12 m4 l4 no-margin">
        <a href="/posts-categoria/{{link | downcase | replace: "ê", "e" | replace: "õ","o"}}">
            <div class="img-container">
                <img class="img-image" src="/{{ site.baseurl }}public/img/{{image}}.jpg" alt="Avatar">
                <div class="img-overlay-itj">
                    <div class="img-text">
                        <h2 class="center-align huge light-font img-title">
                            Teste
                        </h2>
                    </div>
                </div>
            </div>
        </a>
	</div>   
    <div class="col s12 m4 l4 no-margin">
        <a href="/posts-categoria/{{link | downcase | replace: "ê", "e" | replace: "õ","o"}}">
            <div class="img-container">
                <img class="img-image" src="/{{ site.baseurl }}public/img/{{image}}.jpg" alt="Avatar">
                <div class="img-overlay-itj">
                    <div class="img-text">
                        <h2 class="center-align huge light-font img-title">
                            Teste 2
                        </h2>
                    </div>
                </div>
            </div>
        </a>
	</div>   
    <div class="col s12 m4 l4 no-margin">
        <a href="/posts-categoria/{{link | downcase | replace: "ê", "e" | replace: "õ","o"}}">
            <div class="img-container">
                <img class="img-image" src="/{{ site.baseurl }}public/img/{{image}}.jpg" alt="Avatar">
                <div class="img-overlay-itj">
                    <div class="img-text">
                        <h2 class="center-align huge light-font img-title">
                            Teste 3
                        </h2>
                    </div>
                </div>
            </div>
        </a>
	</div>   
</div>
