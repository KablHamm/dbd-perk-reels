"""
Runs the Perk Randomiser on this computer so the "Check for new perks" button can work.

    python server.py            start it (then browse to http://localhost:8417)
    python server.py --open     start it and open the browser
    python server.py 9000       use a different port

Only this computer can reach it. Close the window to stop it.
"""
import json, os, sys, threading, webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ROOT, "tools"))
import update_from_wiki as wiki  # noqa: E402

LOCAL_NAMES = ("localhost", "127.0.0.1")
busy = threading.Lock()


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        # always serve the newest perk files, never a cached copy
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def reply(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if self.path != "/api/check":
            return self.send_error(404)
        # Only accept requests that come from this app's own page.
        host = self.headers.get("Host", "")
        origin = self.headers.get("Origin")
        if host.split(":")[0] not in LOCAL_NAMES or (origin and origin != "http://" + host):
            return self.send_error(403)
        try:
            length = int(self.headers.get("Content-Length") or 0)
            wants = json.loads(self.rfile.read(length) or b"{}")
            add = bool(wants.get("add")) if isinstance(wants, dict) else False
        except ValueError:
            return self.send_error(400)
        if not busy.acquire(blocking=False):
            return self.reply(409, {"error": "A check is already running."})
        try:
            self.reply(200, wiki.run(add=add))
        except Exception as e:
            self.reply(502, {"error": str(e)})
        finally:
            busy.release()


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    port = int(args[0]) if args else 8417
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    url = f"http://localhost:{port}"
    print(f"Perk Randomiser is running at {url}  (close this window to stop it)")
    if "--open" in sys.argv:
        threading.Timer(0.6, webbrowser.open, [url]).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
