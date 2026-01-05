---
layout: page
title: Projects
permalink: /projects/
---

<section class="post-list">
  {% for post in site.posts %}
    {% if post.category == "project" %}
     <article class="post-item">
      <div class="article-title">
        <a class="post-link" target="_blank" href="{{ post.link }}"
          >{{ post.title }}
        </a>
      </div>
      <span class="post-meta">{{ post.description }}</span>
    </article>
    {% endif %}
  {% endfor %}
</section>
