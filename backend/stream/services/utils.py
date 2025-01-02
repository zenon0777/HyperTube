from urllib.parse import quote
import subprocess
import os
from crontab import CronTab

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

def convert_mp4_to_mkv(input_path: str, output_path: str) -> bool:
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input file not found: {input_path}")
    
    if output_path is None:
        output_path = os.path.splitext(input_path)[0] + '.mkv'
    
    try:
        command = [
            'ffmpeg',
            '-i', input_path,
            '-c', 'copy',
            '-y',
            output_path
        ]
        
        subprocess.run(command, check=True, capture_output=True, text=True)

        if os.path.exists(output_path):
            return True
        return False
        
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg error: {e.stderr}")
        return False

def create_cron_tap(folder_name: str):
    my_cron = CronTab(user='mbenkhat')
    job = my_cron.new(command='echo test > test.txt')
    job.day.every(1)
    my_cron.write()
    job.clear()

if __name__ == '__main__':
    create_cron_tap('')
