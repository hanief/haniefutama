---
layout: page
title: Codes
permalink: /codes/
---

<section class="post-list">
  {% for post in site.posts %}
    {% if post.category == "code" %}
    <article class="post-item">
      <span class="post-meta date-label">{{ post.date | date: "%d/%m/%y" }}</span>
      <div class="article-title"><a class="post-link" href="{{ post.url | prepend: site.baseurl | prepend: site.url }}">{{ post.title }}</a></div>
    </article>
    {% endif %}
  {% endfor %}
</section>
