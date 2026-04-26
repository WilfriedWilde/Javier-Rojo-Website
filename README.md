# Javier Rojo – Official Website

Official website for jazz saxophonist **Javier Rojo**.
This project was designed to provide a flexible and scalable platform where the artist can independently manage content, publish updates, and present his work through a dynamic and modern interface.

## Overview

The website combines a **performative visual layer** (animations and transitions) with a **content management system built on external tools**, allowing the client to update the site without directly interacting with the codebase.

A central goal of the project was to create a system where **content, media, and news can be updated autonomously**, while maintaining a refined and fluid user experience.

## Features

* **Responsive design**

    Optimized for all screen sizes, from mobile to desktop.

* **Dynamic multilingual system (EN / ES)**

    Custom-built translation system allowing seamless switching between English and Spanish.
    Content is updated in real time without page reload, ensuring smooth navigation.

* **Animated interface (GSAP)**

    Uses GSAP to create fluid, performant animations across the site.

* **Seamless page transitions (Barba.js)**

    Integrated Barba.js for smooth transitions between pages without full reloads.

* **News section (Google Sheets + Google Docs)**

    * Client can publish and manage news entries via Google Sheets
    * Rich text content is handled through the **Google Docs API**, allowing formatted text (paragraphs, emphasis, structure)
    * Enables a lightweight CMS-like workflow without a backend

* **Media management system**
    
    * Fully customizable via Google Sheets:
    * Supports links to platforms such as:

        * YouTube
        * Spotify
        * Bandcamp
        * Tidal
   
    * Image uploads handled through Cloudinary
    * Content updates require no code changes

* **Custom image upload system**

    A dedicated web form allows the client to upload images directly to Cloudinary, simplifying asset management.

* **Contact section**

    * Email contact form powered by **Formspree**
    * Messages are forwarded directly to the client’s personal email

* **Decoupled content architecture**
    The site leverages external services (Google Sheets, Google Docs, Cloudinary) as a lightweight CMS, ensuring:
    * Easy updates
    * No backend maintenance
    * High flexibility

## Tech Stack

* **HTML5** – structure
* **CSS3** – styling and layout
* **JavaScript (Vanilla)** – logic and data handling

External services and libraries:

* **GSAP** – animations
* **Barba.js** – page transitions
* **Google Sheets** – content management
* **Google Docs API** – formatted text content
* **Cloudinary** – image hosting
* **Formspree** – contact form handling

## Content Management Workflow

The website is designed so the client can update content without developer intervention:

* **News** → Google Sheets + Google Docs
* **Media** → Google Sheets (links + Cloudinary images)
* **Images** → Custom upload form → Cloudinary
* **Contact** → Formspree

This approach provides a CMS-like experience without a traditional backend.

## Purpose

This project focuses on combining:

* **Autonomy** (client-managed content)
* **Performance** (lightweight frontend architecture)
* **Expressive design** (animations and transitions)

The result is a platform that reflects the artist’s identity while remaining highly maintainable and scalable.

## Author

Developed and designed by **Wilfried Wilde**
