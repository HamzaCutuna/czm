Project Overview

This project is a Next.js web application for the Center for Peace and Multiethnic Cooperation. The main goal of the website is to digitally preserve cultural and historical heritage through an interactive web platform.

The application will present historical events that occurred on each day of the year, with a special focus on Bosnia and Herzegovina, but also including events from the region and the world.

The backend API (already provided) supplies daily historical events, which will be consumed by the Next.js frontend. These events are manually collected and stored, and the API can return events for “today” or any other selected date.

⚠️ Important note: The entire website content (UI, texts, month/day names, etc.) must be in Bosnian language using ijekavian standard. No Serbian “ekavian” forms (e.g. “Svetska”, “istorija”, “obeležili”) should appear. Instead, it must always be “Svjetska”, “historija”, “obilježili”, etc.

Core Features

Hero Section (Landing Page):

Interactive carousel displaying historical events for today’s date.

Carousel should support multiple events with navigation arrows (show at least 3 events at once, with the ability to scroll for more).

Title for “Today’s Events” should be positioned just above the carousel.

Interactive Map:

World map with pins/markers placed on the countries where today’s events occurred.

Clicking a pin shows details of the event.

Events Database View:

A calendar/timeline where the user can select a date and see all events for that day.

Events categorized as Bosnia and Herzegovina, Region, and World.

Event Details Page:

Each event should have its own detail page with full description, date, and optionally images.

Responsiveness:

The website must be fully mobile-first responsive, since most users will access it from mobile phones.

Languages:

Primary language: Bosnian.

(Later) optional support for English.

Technical Stack

Frontend: Next.js (latest, with App Router) + TypeScript

Styling: Tailwind CSS + ShadCN (Radix UI components)

Animations: Framer Motion (for smooth transitions & interactive UI)

Icons: Lucide React

Backend: Provided REST API (already implemented in C# .NET Core, not part of this project)

Database: Events data already handled by the existing API

Design Goals

Clean, modern, and interactive design.

Mobile-first approach.

Hero section should not look empty: carousel + title should fill the top view.

Bosnian language UI everywhere (ijekavian).