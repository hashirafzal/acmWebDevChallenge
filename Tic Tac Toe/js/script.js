import View from "./view.js";
const app = {
  $: {
    menu: document.querySelector("[data-id='menu']"),
    menuItems: document.querySelector("[data-id='menu-items']"),
    resetBtn: document.querySelector("[data-id='reset-btn']"),
    newRoundBtn: document.querySelector("[data-id='new-round-btn']"),
    squares: document.querySelectorAll("[data-id='square']"),
    modal: document.querySelector("[data-id='modal']"),
    modalText: document.querySelector("[data-id='modal-text']"),
    modalBtn: document.querySelector("[data-id='modal-btn']"),
    turn: document.querySelector("[data-id='turn']"),
  },
  state: {
    moves: [],
  },

  getGameStatus(moves) {
    const p1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.squareId);

    const p2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.squareId);

    // Winning Patterns
    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];
    let winner = null;
    winningPatterns.forEach((pattern) => {
      const p1Wins = pattern.every((v) => p1Moves.includes(v));
      const p2Wins = pattern.every((v) => p2Moves.includes(v));

      if (p1Wins) winner = 1;
      if (p2Wins) winner = 2;
    });
    return {
      status: moves.length === 9 || winner != null ? "complete" : "in-progress", //In progress || Complete
      winner, //  1 ||  2 || tie
    };
  },
  init() {
    app.registerEventListeners();
  },

  registerEventListeners() {
    app.$.menu.addEventListener("click", (event) => {
      app.$.menuItems.classList.toggle("hidden");
    });
    app.$.resetBtn.addEventListener("click", (event) => {
      app.state.moves = [];
      app.$.squares.forEach((square) => square.replaceChildren());
    });
    app.$.newRoundBtn.addEventListener("click", (event) => {
      app.state.moves = [];
      app.$.squares.forEach((square) => square.replaceChildren());
    });
    app.$.modalBtn.addEventListener("click", (event) => {
      app.state.moves = [];
      app.$.squares.forEach((square) => square.replaceChildren());
      app.$.modal.classList.add("hidden");
    });

    app.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        const hasMove = (squareId) => {
          const existingMove = app.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };
        if (hasMove(+square.id)) {
          return;
        }

        const lastMove = app.state.moves.at(-1);
        const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
        const currentPlayer =
          app.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerId);
        const nextPlayer = getOppositePlayer(currentPlayer);
        const icon = document.createElement("i");
        const icon1 = document.createElement("i");
        const text = document.createElement("p");
        text.innerText = `Player ${nextPlayer}'s Turn`;
        if (currentPlayer === 1) {
          icon.classList.add("fa-solid", "fa-x", "yellow");
          text.classList = "turquoise";
          icon1.classList.add("fa-solid", "fa-o", "turquoise");
        } else {
          icon.classList.add("fa-solid", "fa-o", "turquoise");
          text.classList = "yellow";
          icon1.classList.add("fa-solid", "fa-x", "yellow");
          // text.textContent("Player 2,Your turn");
        }

        //Pushing moves played by each player
        app.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });

        //Check which player turn is this.

        square.replaceChildren(icon);
        app.$.turn.replaceChildren(icon1, text);

        const game = app.getGameStatus(app.state.moves);
        if (game.status === "complete") {
          app.$.modal.classList.remove("hidden");
          let message = "";
          if (game.winner) {
            message = `Player ${game.winner} Wins`;
          } else {
            message = `Draw`;
          }
          app.$.modalText.textContent = message;
        }
      });
    });
  },
};

window.addEventListener("load", app.init);

function init() {
  const view = new View();
}
