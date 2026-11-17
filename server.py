import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def run():
    port = PORT
    max_tries = 10
    httpd = None

    for p in range(port, port + max_tries):
        try:
            httpd = socketserver.TCPServer(("", p), Handler)
            port = p
            break
        except OSError:
            continue

    if not httpd:
        print(f"Could not bind to any port between {PORT} and {PORT + max_tries}")
        sys.exit(1)

    url = f"http://localhost:{port}"
    print("=" * 60)
    print("🚀 Study Plan Rebalancer — Server Avviato!")
    print(f"📍 URL: {url}")
    print("📂 Cartella:", DIRECTORY)
    print("Premere CTRL+C per arrestare il server.")
    print("=" * 60)

    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nArresto del server...")
        httpd.server_close()

if __name__ == "__main__":
    run()
