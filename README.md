# SoPra Group 04 FS23 - STADT LAND **+**

Welcome to Stadt Land Plus! This project is the result of our Software Lab class at the University of Zurich, where we were tasked with the challenge of developing a software application. We decided to create a game, taking inspiration from the classic Swiss game, 'Stadt Land Fluss', also known as 'Categories' in English.
This is the repository of the front-end part of our implementation, you will find the back-end part [here](https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-server). 

## Introduction
Embark on a thrilling journey with Stadt Land Plus, a captivating multiplayer word game! By brainstorming words within chosen categories and a surprise random letter, players are immersed in a realm of fast-paced learning and fun. The unique twist? A democratic voting system that brings a dash of unpredictability while guaranteeing fairness in validating answers. Get ready to ignite your mind!

## Motivation
Our motivation behind this game was to design a multiplayer experience that not only provides entertainment but also educational value. By choosing categories and brainstorming words, players can broaden their general knowledge and improve quick thinking skills.

## Technologies
The client is written in JSX using React. To ensure a consistent and appealing UI, [Mantine](https://mantine.dev) components are used for styling. 

Connection between the front-end and back-end: REST is used to fetch and send information with requests from the front-end. When starting a new game, a stomp webstocket connection is established to ensure a synchronized gameplay for all players.

## High-level components

Once the round starts, a short countdown appears and the round's letter is revealed. All players are sent to the [Board](https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/blob/main/src/components/views/game/%5Bgame_id%5D/Board.jsx) where they have to find a word for every category as fast as possible. The view can be changed from the overview to single categories and back. As soon as the player has answered all categories, a "done" button appears and they can finish the round early.

When the first player is finished or the clock has run down, the [Voting](https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/blob/main/src/components/views/game/%5Bgame_id%5D/Voting.jsx) begins. Players have to rate the other players' answers. A majority vote decides on how many points each answer gets. When all players have clicked the "done" button or the clock has run down, the votes are sent to the back-end by rest api request and all players are forwarded to the voting results.

All in-game pages are children of the [InGameRouter](https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/blob/main/src/components/routing/routers/InGameRouter.jsx) which establishes a websocket connection with the back-end and passes the websocket messages as props. The single websocket makes it possible to lead all players synchronously through the gameflow. The Compontent also provides futher common functionalities like the blocking of backwards navigation and handling of tabcloses.

To reduce coupling, all RestApi requests are handled by [RestApi](https://github.com/sopra-fs22-group-17/RaveWave-client/blob/master/src/api/RestApi.ts). 

## Launch & Deployment

- npm install

  Installs external dependencies.
  Run this command before starting the application for the first time.

- npm run dev

  Runs the app in the development mode.
  Open http://localhost:3000 to view it in the browser.

  The page will reload if you make edits.
  You will also see any lint errors in the console.

- Your app is ready to be deployed!
  
## Illustrations

Stand Land PLUS is optimized for mobile phones. For the perfect playing experience, a screen size of at least 5.4in (e.g. iPhone 13 mini) is recommended.

<div align="center">
  <h3>
    <br>
    login:
  <br>
  </h3>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/Login.png" alt="login" width="240"></a>
  <p> login as an existing user<p>
</div>

<div align="center">
  <h3>
    <br>
    registration:
  <br>
  </h3>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/Registration.png" alt="registration" width="240"></a>
  <p> sign up as a new user<p>
</div>

<div align="center">
  <h3>
    <br>
    homescreen:
  <br>
  </h3>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/Welcome.png" alt="welcome" width="240"></a>
  <p> start a game or choose an option from the menu<p>
</div>

<div align="center">
  <h3>
    <br>
    homescreen (open menu):
  <br>
  </h3>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/WelcomeMenu.png" alt="welcomeMenu" width="240"></a>
  <p> navigate to other pages via menu<p>
</div>

<div align="center">
  <h3>
    <br>
    game rules:
  <br>
  </h3>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/Rules.png" alt="rules" width="240"></a>
  <p> how do I play this game?<p>
</div>

<div align="center">
  <h3>
    <br>
    change winning quote:
  <br>
  </h3>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/Quote.png" alt="quote" width="240"></a>
  <p> write or generate a winning quote<p>
</div>

<div align="center">
  <h3>
    <br>
    game center:
  <br>
  </h3>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/GameCenter.png" alt="gameCenter" width="240"></a>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/Rejoin.png" alt="rejoin" width="240"></a>
  <p> create a new game as a host or join an existing lobby by PIN. <br>
  if you left a game on accident, you have the choice to rejoin or leave properly<p>
</div>

<div align="center">
  <h3>
    <br>
    category selection:
  <br>
  </h3>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/Category.png" alt="category" width="240"></a>
  <p> choose the categories for your game<p>
</div>

<div align="center">
  <h3>
    <br>
    game settings:
  <br>
  </h3>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/Settings.png" alt="settings" width="240"></a>
  <p> choose the settings for your game<p>
</div>

<div align="center">
  <h3>
    <br>
    lobby:
  <br>
  </h3>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/Lobby.png" alt="lobby" width="240"></a>
  <p> wait for other players and start the game<p>
</div>

<div align="center">
  <h3>
    <br>
    board:
  <br>
  </h3>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/Board.png" alt="board" width="240"></a>
    <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/BoardAll.png" alt="boardAll" width="240"></a>
  <p> choose a category to answer, see status of category <br>
  click "done" when all categories are answered to end the round</p>
</div>

<div align="center">
  <h3>
    <br>
    answer:
  <br>
  </h3>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/Answer.png" alt="answer" width="240"></a>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/AnswerAll.png" alt="answerAll" width="240"></a>
  <p> type in your answer, <br> 
    click "done" when all categories are answered to end the round</p>
</div>

<div align="center">
  <h3>
    <br>
    voting:
  <br>
  </h3>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/Voting.png" alt="voting" width="240"></a>
  <p> rate the other players' answers<p>
</div>

<div align="center">
  <h3>
    <br>
    voting results:
  <br>
  </h3>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/VotingResult.png" alt="votingResults" width="240"></a>
  <p> see the voting results (majority vote)<p>
</div>


<div align="center">
  <h3>
    <br>
    scoreboard:
  <br>
  </h3>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/Score.png" alt="score" width="240"></a>
  <p> see the total score, game progress and a random fact<p>
</div>

<div align="center">
  <h3>
    <br>
    winner:
  <br>
  </h3>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/Winner.png" alt="winner" width="240"></a>
  <p> the winner is announced<p>
</div>

<div align="center">
  <h3>
    <br>
    profile page:
  <br>
  </h3>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/UserPage.png" alt="userPage" width="240"></a>
  <p> see the user's stats<p>
</div>

<div align="center">
  <h3>
    <br>
    leaderboard:
  <br>
  </h3>
  <a href="(https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-client/tree/main/ReadMePictures)"><img src="/ReadMePictures/Leaderboard.png" alt="leaderboard" width="240"></a>
  <p> the hall of fame<p>
</div>

## Roadmap

- categories "surprise me": instead of choosing categories manually, the host can choose the option to have the categories chosen randomly by the server 
- Public lobbies: players can find and join lobbies without a PIN
- Sudden Death Mode: Player with the least points after a round is eliminated
- voice chat: to discuss votings when playing remotely

## Authors and acknowledgement

SoPra Group 04 2023 consists of [Valentin Meyer](https://github.com/VaLeoMe), [Remo Wiget](https://github.com/wigeto), [Christopher Narayanan](https://github.com/Queentaker), [Lennart Töllke](https://github.com/LexuTros) and [Alexandre Bacmann](https://github.com/ABacmann).

We want to thank our teaching assistant [Hyeongkyun (Kaden) Kim](https://github.com/hk-kaden-kim) for his help and guidance during the project.

## License

Licensed under [Apache License 2.0](https://github.com/sopra-fs23-group-4/sopra-fs23-group-04-server/blob/main/LICENSE)
