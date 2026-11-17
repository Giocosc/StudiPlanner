import http.server
import socketserver
import webbrowser
import os
import sys
import socket

HOST = "0.0.0.0"  # Binding su tutte le interfacce per accesso locale e LAN
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

def get_local_ip():
    """Rileva l'indirizzo IP locale (LAN) del PC per accesso da altri dispositivi."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        try:
            return socket.gethostbyname(socket.gethostname())
        except Exception:
            return "127.0.0.1"

def run():
    port = PORT
    max_tries = 10
    httpd = None

    socketserver.TCPServer.allow_reuse_address = True

    for p in range(port, port + max_tries):
        try:
            httpd = socketserver.TCPServer((HOST, p), Handler)
            port = p
            break
        except OSError:
            continue

    if not httpd:
        print(f"Could not bind to any port between {PORT} and {PORT + max_tries}")
        sys.exit(1)

    local_ip = get_local_ip()
    local_url = f"http://localhost:{port}"
    lan_url = f"http://{local_ip}:{port}"

    print("=" * 60)
    print("🚀 StudiPlanner — Server Avviato!")
    print(f"📍 Accesso Locale (PC):     {local_url}")
    print(f"📱 Accesso LAN (iPad/Mac):  {lan_url}")
    print(f"🌐 Host Binding:            {HOST}:{port}")
    print(f"📂 Cartella radice:         {DIRECTORY}")
    print("Premere CTRL+C per arrestare il server.")
    print("=" * 60)

    # Apre il browser solo se non avviato con --no-browser (es. esecuzione come servizio)
    if "--no-browser" not in sys.argv:
        try:
            webbrowser.open(local_url)
        except Exception:
            pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nArresto del server...")
        httpd.server_close()

if __name__ == "__main__":
    run()
