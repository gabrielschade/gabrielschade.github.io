---
layout: home
title: Home
---

## Posts

{% for post in site.posts %}
  {% include postdate.html %}  
  [ {{ post.title }} ] ({{ post.url }})
{% endfor %}
