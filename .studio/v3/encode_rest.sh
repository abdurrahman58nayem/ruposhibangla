#!/usr/bin/env bash
set -u
cd "$(dirname "$0")/../render_ad" || exit 1
FF=$(/home/user/venv/bin/python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
OUT=../deliver23_ad
echo "== 1080"
$FF -y -hide_banner -loglevel error -framerate 30 -i frames/%05d.jpg -i mix.wav \
    -vf "scale=1080:1920:flags=lanczos" -threads 2 \
    -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -profile:v high -level 5.1 \
    -movflags +faststart -c:a aac -b:a 160k -shortest "${OUT}/.tmp_01.mp4" \
    && mv -f "${OUT}/.tmp_01.mp4" "${OUT}/01-combo-ad-1080x1920.mp4" \
    && echo "ok 1080 $(stat -c%s "${OUT}/01-combo-ad-1080x1920.mp4")"
echo "== 15s"
$FF -y -hide_banner -loglevel error -i "${OUT}/00-combo-ad-4k.mp4" \
    -filter_complex "[0:v]select='between(t,0,5.2)+between(t,20.4,23.0)+between(t,28.9,32.3)+between(t,36.2,40.0)',setpts=N/30/TB[v];[0:a]aselect='between(t,0,5.2)+between(t,20.4,23.0)+between(t,28.9,32.3)+between(t,36.2,40.0)',asetpts=N/30/TB[a]" \
    -map "[v]" -map "[a]" -threads 2 -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
    -profile:v high -level 5.1 -movflags +faststart -c:a aac -b:a 160k \
    "${OUT}/.tmp_02.mp4" && mv -f "${OUT}/.tmp_02.mp4" "${OUT}/02-combo-ad-15s.mp4" \
    && echo "ok 15s $(stat -c%s "${OUT}/02-combo-ad-15s.mp4")"
echo rest-done
