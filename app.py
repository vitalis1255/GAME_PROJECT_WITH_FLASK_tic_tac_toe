from flask import Flask,render_template, jsonify, request

app = Flask(__name__)

# Initial State of the Game
game_stats = {
  "player_wins":0,
  "ai_wins":0,
  "draws":0
}

#api for home page
@app.route("/")
def index():
  return render_template("index.html", stats=game_stats)


#API for javascript
@pp.route("/api/record_win", methods=["POST"])
def record_win():
  data = request.get_json()#get the data via query request in json format
  winner = data.get("winner")

  if winner == "X":
    game_stats["player_wins"] +=1
  elif winner == "O":
    game_stats["ai_wins"] +=1
  elif winner == "Draw":
    game_stats["draws"] +=1

  return jsonify(success=True, stats=game_stats)# stats will be used in Javascript





if __name__ == "__main__":
  app.run(debug=True)