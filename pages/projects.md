---
layout: page
title: Projects
permalink: /projects/
description: "Encrypted archive of projects"
---

<p class="section-kicker">ENCRYPTED ARCHIVE</p>
<h2>PROJECT DATA BLOCKS</h2>

<div class="data-grid">
  {% assign projects = site.posts | where: 'category', 'project' %}
  {% for post in projects %}
  <article class="data-block project-block" data-title="{{ post.title | escape }}" data-status="Active" data-stack="{{ post.keywords | default: 'React / Node / AI' | escape }}" data-description="{{ post.description | default: post.excerpt | strip_html | strip_newlines | escape }}" data-link="{{ post.link | default: post.url | prepend: site.baseurl | prepend: site.url }}">
    <div class="data-block-header">
      <span>[ PROJECT_{{ forloop.index | prepend: '0' }} ]</span>
      <span class="post-meta">Status: Active</span>
    </div>
    <h3 class="glitch-hover" style="margin-bottom: .5rem;">{{ post.title }}</h3>
    <p class="data-meta">Stack: {{ post.keywords | default: 'React / Node / AI' }}</p>
    <button type="button" class="block-link project-open">Open terminal view →</button>
  </article>
  {% endfor %}
</div>
