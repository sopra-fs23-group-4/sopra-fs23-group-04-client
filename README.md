# SoPra Group 04 FS23 - STADT LAND **+**

Welcome to Stadt Land Plus! This project is the result of our Software Lab class at the University of Zurich, where we were tasked with the challenge of developing a software application. We decided to create a game, taking inspiration from the classic Swiss game, 'Stadt Land Fluss', also known as 'Categories' in English.
This is the repository of the front-end part of our implementation, you will find the back-end part 

## Introduction
Embark on a thrilling journey with Stadt Land Plus, a captivating multiplayer word game! By brainstorming words within chosen categories and a surprise random letter, players are immersed in a realm of fast-paced learning and fun. The unique twist? A democratic voting system that brings a dash of unpredictability while guaranteeing fairness in validating answers. Get ready to ignite your mind!

## Motivation
Our motivation behind this game was to design a multiplayer experience that not only provides entertainment but also educational value. By choosing categories and brainstorming words, players can broaden their general knowledge and improve quick thinking skills.

## Technologies
The client is written in JSX using React. To ensure a consistent and apealing UI, [Mantine](https://mantine.dev) components are used for styling. 

Connection between the front-end and back-end: REST is used to fetch and send information with requests from the front-end. When starting a new game, a stomp webstocket connection is established to ensure a synchronized gameplay for all players.

## High-level components
To individualize the user profile (and adequately gloat in case of a win), each user can choose a winning quote on [Quote](https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/blob/main/src/components/views/profile/edit/Quote.jsx), those who don't feel creative can generate a quote from a variety of quote categories.

A user can either create a new game lobby as a host or join an existing lobby. To create a new game, it is crucial to choose fitting categories. This is why several options are provided in [Categories](https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/blob/main/src/components/views/game/Categories.jsx): next to city and country the host can add custom categories or get random categories from the server to choose from. Once the categories are selected and settings chosen, the game lobby is created.

Once all players have joined the lobby with the PIN, the host can start the game and after a short countdown the first round begins. All players are sent to the [Board] where they have to find a word for every category as fast as possible.
When the first player is finished or the clock has run down, the [Voting](https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/blob/main/src/components/views/game/%5Bgame_id%5D/Voting.jsx) begins and a majority vote decides on how many points each answer gets.

## Launch & Deployment

- npm install

  Installs external dependencies.
  Run this command before starting the application for the first time.

- npm run dev

  Runs the app in the development mode.
  Open http://localhost:3000 to view it in the browser.

  The page will reload if you make edits.
  You will also see any lint errors in the console.

- npm run build

  Builds the app for production to the build folder.
  It correctly bundles React in production mode and optimizes the build for the best performance.

  The build is minified and the filenames include the hashes.
  Your app is ready to be deployed!
  
## Illustrations
<h3 align="center">
  <br>
  GameRules - how do I play this game?
  <br>
</h3>

<h3 align="center">
  <br>
  Registration - new users can sign up.
  <br>
</h3>

<h3 align="center">
  <br>
  Landing Page - start a game or choose an option from the menu.
  <br>
</h3>

<h3 align="center">
  <br>
  Change Quote - write or generate a winning quote.
  <br>
</h3>

<h3 align="center">
  <br>
  GameCenter - start by creating a new game as a host or join an existing lobby by PIN.
  <br>
</h3>

<h3 align="center">
  <br>
  Category Selection - choose the categories for your game.
  <br>
</h3>

<h3 align="center">
  <br>
  Game Settings - choose the settings for your game.
  <br>
</h3>

<h3 align="center">
  <br>
  Lobby - wait for other players and start the game.
  <br>
</h3>

<h3 align="center">
  <br>
  Board - choose a category to answer.
  <br>
</h3>

<h3 align="center">
  <br>
  Answer - type in your answer.
  <br>
</h3>

<h3 align="center">
  <br>
  Voting - rate the other players' answers.
  <br>
</h3>

<h3 align="center">
  <br>
  VotingResult - rate the other players' answers.
  <br>
</h3>

<h3 align="center">
  <br>
  VotingResult - see the voting results (majority vote).
  <br>
</h3>

<h3 align="center">
  <br>
  Scoreboard - see the total score and a random fact.
  <br>
</h3>

<h3 align="center">
  <br>
  Winner - the winner is announced.
  <br>
</h3>

<h3 align="center">
  <br>
  Leaderboard - see the hall of fame.
  <br>
</h3>

<h3 align="center">
  <br>
  Leaderboard - see the hall of fame.
  <br>
</h3>


<h3 align="center">
  <br>
  Leaderboard - see the hall of fame.
  <br>
</h3>

## Roadmap

- Death Mode: Player with the least points after a round is eliminated
- Algorithm to check certain categories for correctness e.g. city and country to improve fairness
- Possibility to play non-synchronized

## Authors and acknowledgement

SoPra Group 04 2023 consists of [Valentin Meyer](https://github.com/VaLeoMe), [Remo Wiget](https://github.com/wigeto), [Christopher Narayanan](https://github.com/Queentaker), [Lennart Tölke](https://github.com/LexuTros) and [Alexandre Bacmann](https://github.com/ABacmann).

We want to thank our teaching assistant [Hyeongkyun (Kaden) Kim](https://github.com/hk-kaden-kim) for his help and guidance during the project.

## License

Licensed under [Apache License 2.0](https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-server/blob/main/LICENSE)
