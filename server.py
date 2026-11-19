import http.server
import socketserver
import webbrowser
import os
import sys
import socket

# Forza la codifica UTF-8 su stdout e stderr (necessario per Windows Service stdout redirect)
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
if hasattr(sys.stderr, "reconfigure"):
    try:
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

HOST = "0.0.0.0"  # Binding su tutte le interfacce per accesso locale e LAN
PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def is_hidden_path(url_path):
    """True se il percorso tocca file o cartelle nascoste (.git, .claude, .env, ...)."""
    from urllib.parse import unquote, urlsplit
    path = unquote(urlsplit(url_path).path).replace("\\", "/")
    return any(part.startswith(".") for part in path.split("/") if part)


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def send_head(self):
        # Il server e' raggiungibile da tutta la LAN (0.0.0.0): la cartella radice e' il
        # repository, quindi senza questo filtro chiunque in rete poteva scaricare .git
        # (cronologia completa) e altri file nascosti.
        if is_hidden_path(self.path):
            self.send_error(404, "File not found")
            return None
        return super().send_head()

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

def safe_print(*args, **kwargs):
    """Stampa sicura che non genera eccezioni anche se l'encoding della pipe e' ristretto."""
    try:
        print(*args, **kwargs)
    except Exception:
        try:
            cleaned = [str(a).encode("ascii", errors="replace").decode("ascii") for a in args]
            print(*cleaned, **kwargs)
        except Exception:
            pass

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
        safe_print(f"Could not bind to any port between {PORT} and {PORT + max_tries}")
        sys.exit(1)

    local_ip = get_local_ip()
    local_url = f"http://localhost:{port}"
    lan_url = f"http://{local_ip}:{port}"

    safe_print("=" * 60)
    safe_print("🚀 StudiPlanner — Server Avviato!")
    safe_print(f"📍 Accesso Locale (PC):     {local_url}")
    safe_print(f"📱 Accesso LAN (iPad/Mac):  {lan_url}")
    safe_print(f"🌐 Host Binding:            {HOST}:{port}")
    safe_print(f"📂 Cartella radice:         {DIRECTORY}")
    safe_print("Premere CTRL+C per arrestare il server.")
    safe_print("=" * 60)

    # Apre il browser solo se non avviato con --no-browser (es. esecuzione come servizio)
    if "--no-browser" not in sys.argv:
        try:
            webbrowser.open(local_url)
        except Exception:
            pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        safe_print("\nArresto del server...")
        httpd.server_close()

if __name__ == "__main__":
    run()
