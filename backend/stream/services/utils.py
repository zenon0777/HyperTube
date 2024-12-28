from urllib.parse import quote

trackers = [
    "udp://open.demonii.com:1337/announce",
    "udp://tracker.openbittorrent.com:80",
    # "udp://tracker.coppersurfer.tk:6969",
    # "udp://glotorrents.pw:6969/announce",
    # "udp://tracker.opentrackr.org:1337/announce",
    # "udp://torrent.gresille.org:80/announce",
    # "udp://p4p.arenabg.com:1337",
    # "udp://tracker.leechers-paradise.org:6969",
]


def construct_magnet_link(torrent_hash: str, movie_name: str) -> str:
    base_url = "magnet:?"
    encoded_movie_name = quote(movie_name)
    xt_param = f"xt=urn:btih:{torrent_hash}"
    dn_param = f"dn={encoded_movie_name}"
    tr_params = "&".join(f"tr={tracker}" for tracker in trackers)

    return f"{base_url}{xt_param}&{dn_param}&{tr_params}"
