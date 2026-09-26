from flask import Flask,render_template

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






if __name__ == "__main__":
  app.run(debug=True)