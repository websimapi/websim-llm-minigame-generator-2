import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useSyncExternalStore } from "use-sync-external-store";
import WebsimSocket from "./WebsimSocket";
import MinigameGenerator from "./MinigameGenerator";
function App() {
  const [room] = useState(() => new WebsimSocket());
  const [generator] = useState(() => new MinigameGenerator(room));
  const [currentGame, setCurrentGame] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const peers = useSyncExternalStore(
    room.party.subscribe,
    () => room.party.peers
  );
  const games = useSyncExternalStore(
    room.collection("minigame").subscribe,
    room.collection("minigame").getList
  );
  const isHost = generator.isHost(room.party.client.id);
  useEffect(() => {
    room.onmessage = (event) => {
      const data = event.data;
      if (data.type === "startGame") {
        setCurrentGame(data.game);
      }
    };
  }, [room]);
  const generateNewGame = async () => {
    if (!isHost) return;
    setIsGenerating(true);
    try {
      const players = Object.values(peers);
      const newGame = await generator.generateMinigame(players);
      await room.collection("minigame").create({
        ...newGame,
        players: players.map((p) => p.username),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      room.send({
        type: "startGame",
        game: newGame
      });
      setCurrentGame(newGame);
    } catch (error) {
      console.error("Failed to generate game:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  const startSavedGame = (game) => {
    room.send({
      type: "startGame",
      game
    });
    setCurrentGame(game);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "container", children: [
    /* @__PURE__ */ jsxDEV("h1", { children: "LLM Minigame Generator" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 73,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "players-list", children: Object.entries(peers).map(([id, peer]) => /* @__PURE__ */ jsxDEV("div", { children: /* @__PURE__ */ jsxDEV(
      "img",
      {
        src: `https://images.websim.ai/avatar/${peer.username}`,
        alt: peer.username,
        className: "player-avatar",
        title: `${peer.username}${id === room.party.client.id ? " (You)" : ""}`
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 78,
        columnNumber: 13
      },
      this
    ) }, id, false, {
      fileName: "<stdin>",
      lineNumber: 77,
      columnNumber: 11
    }, this)) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 75,
      columnNumber: 7
    }, this),
    isHost && /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: generateNewGame,
        disabled: isGenerating,
        children: isGenerating ? "Generating..." : "Generate New Game"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 89,
        columnNumber: 9
      },
      this
    ),
    currentGame && /* @__PURE__ */ jsxDEV("div", { className: "game-area", children: [
      /* @__PURE__ */ jsxDEV("h2", { children: currentGame.title }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 99,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { children: currentGame.description }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 100,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("h3", { children: "Rules:" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 101,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("ul", { children: currentGame.rules.map((rule, i) => /* @__PURE__ */ jsxDEV("li", { children: rule }, i, false, {
        fileName: "<stdin>",
        lineNumber: 104,
        columnNumber: 15
      }, this)) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 102,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { children: [
        /* @__PURE__ */ jsxDEV("strong", { children: "Win Condition:" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 107,
          columnNumber: 14
        }, this),
        " ",
        currentGame.winCondition
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 107,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { children: [
        /* @__PURE__ */ jsxDEV("strong", { children: "Duration:" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 108,
          columnNumber: 14
        }, this),
        " ",
        currentGame.duration,
        " seconds"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 108,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { children: [
        /* @__PURE__ */ jsxDEV("strong", { children: "Scoring:" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 109,
          columnNumber: 14
        }, this),
        " ",
        currentGame.scoring.details
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 109,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 98,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "game-history", children: [
      /* @__PURE__ */ jsxDEV("h2", { children: "Previous Games" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 114,
        columnNumber: 9
      }, this),
      games.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((game) => /* @__PURE__ */ jsxDEV("div", { className: "game-card", onClick: () => startSavedGame(game), children: [
        /* @__PURE__ */ jsxDEV("h3", { children: game.title }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 117,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { children: game.description }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 118,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("small", { children: [
          "Played by: ",
          game.players.join(", ")
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 119,
          columnNumber: 13
        }, this)
      ] }, game.id, true, {
        fileName: "<stdin>",
        lineNumber: 116,
        columnNumber: 11
      }, this))
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 113,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 72,
    columnNumber: 5
  }, this);
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 129,
  columnNumber: 13
}));
