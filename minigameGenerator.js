class MinigameGenerator {
  constructor(room) {
    this.room = room;
  }

  async generateMinigame(players) {
    const prompt = `Create a fun, short multiplayer minigame for ${players.length} players.
    The game should be quick (1-3 minutes), easy to understand, and engaging.
    Include specific rules, winning conditions, and how to play.
    
    Current players:
    ${players.map(p => p.username).join(', ')}
    
    interface MinigameResponse {
      title: string;
      description: string;
      rules: string[];
      winCondition: string;
      gameType: "reaction" | "memory" | "trivia" | "creativity" | "coordination";
      minPlayers: number;
      maxPlayers: number;
      duration: number; // in seconds
      scoring: {
        type: "points" | "time" | "rounds";
        details: string;
      };
    }
    
    {
      "title": "Color Chain Reaction",
      "description": "Players must quickly tap colors in sequence, building upon the previous player's pattern",
      "rules": [
        "Each player adds one color to the sequence when it's their turn",
        "Players must remember and repeat the entire sequence correctly",
        "Making a mistake eliminates the player"
      ],
      "winCondition": "Last player standing wins",
      "gameType": "memory",
      "minPlayers": 2,
      "maxPlayers": 8,
      "duration": 120,
      "scoring": {
        "type": "rounds",
        "details": "Players score 1 point for each successful sequence they complete"
      }
    }`;

    try {
      const response = await fetch('/api/ai_completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          data: JSON.stringify(players)
        }),
      });
      
      const gameData = await response.json();
      return gameData;
    } catch (error) {
      console.error('Error generating minigame:', error);
      throw error;
    }
  }

  isHost(clientId) {
    // Get all peers sorted by connection time
    const sortedPeers = Object.entries(this.room.party.peers)
      .sort((a, b) => a[1].connectedAt - b[1].connectedAt);
    
    // First connected peer still in the room is the host
    return sortedPeers.length > 0 && sortedPeers[0][0] === clientId;
  }
}