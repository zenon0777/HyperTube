import subprocess
import os
from typing import Optional

def convert_mp4_to_mkv(input_path: str, output_path: Optional[str] = None) -> bool:
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input file not found: {input_path}")
    
    # Generate output path if not provided
    if output_path is None:
        output_path = os.path.splitext(input_path)[0] + '.mkv'
    
    try:
        # Construct FFmpeg command
        command = [
            'ffmpeg',
            '-i', input_path,  # Input file
            '-c', 'copy',      # Copy streams without re-encoding
            '-y',              # Overwrite output file if it exists
            output_path
        ]
        
        # Run FFmpeg command
        subprocess.run(command, check=True, capture_output=True, text=True)
        
        # Verify the output file was created
        if os.path.exists(output_path):
            return True
        return False
        
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg error: {e.stderr}")
        return False

input_file = "./_Movies/Oppenheimer (2023) [720p] [BluRay] [YTS.MX]/Oppenheimer.2023.720p.BluRay.x264.AAC-[YTS.MX].mp4"
output_path = input_file.replace(".mp4", ".mkv")

convert_mp4_to_mkv(input_file, output_path)