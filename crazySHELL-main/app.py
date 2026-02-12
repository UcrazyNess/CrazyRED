from flask import Flask, jsonify ,request
from sysInfo import SystemMonitor
from shell import Shell

app = Flask(__name__)


@app.route("/command", methods=['POST'])
def info():
    data = request.get_json()
    
    if not data or 'command' not in data:
        return jsonify({"error": "No command provided"}), 400
        
    import asyncio
    result = asyncio.run(Shell.run(data['command']))
    
    return jsonify(result)

@app.route("/monitor", methods=['GET'])
def monitor():
    return jsonify(SystemMonitor.monitor())

if __name__ == "__main__":
    app.run(port=5000, debug=True, threaded=True)