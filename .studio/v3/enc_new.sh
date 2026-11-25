#!/usr/bin/env bash
set -u
cd "$(dirname "$0")/../render_new" || exit 1
FF=$(/home/user/venv/bin/python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
OUT=../deliver_new
mkdir -p "$OUT"
SEG=/tmp/segnew; rm -rf $SEG; mkdir -p $SEG
N=1164; STEP=240; i=0; s=0; : > $SEG/list.txt
while [ $s -lt $N ]; do
  printf -v name "%02d" $i
  $FF -y -hide_banner -loglevel error -framerate 30 -start_number $s \
      -i frames/%05d.jpg -frames:v $STEP -threads 1 \
      -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -profile:v high \
      -level 5.1 -x264-params threads=1:lookahead-threads=1 "$SEG/p$name.mp4" || exit 1
  echo "file 'p$name.mp4'" >> $SEG/list.txt
  echo "seg $name $s"
  s=$((s+STEP)); i=$((i+1))
done
$FF -y -hide_banner -loglevel error -f concat -safe 0 -i $SEG/list.txt -i mix.wav \
    -c:v copy -c:a aac -b:a 192k -movflags +faststart -shortest "$OUT/.t4k.mp4" || exit 1
mv -f "$OUT/.t4k.mp4" "$OUT/00-combo-ad-4k.mp4"
echo "ok 4k $(stat -c%s "$OUT/00-combo-ad-4k.mp4")"
$FF -y -hide_banner -loglevel error -framerate 30 -i frames/%05d.jpg -i mix.wav \
    -vf scale=1080:1920:flags=lanczos -threads 2 -c:v libx264 -preset medium -crf 19 \
    -pix_fmt yuv420p -profile:v high -level 5.1 -movflags +faststart \
    -c:a aac -b:a 160k -shortest "$OUT/.t1080.mp4" || exit 1
mv -f "$OUT/.t1080.mp4" "$OUT/01-combo-ad-1080x1920.mp4"
echo "ok 1080 $(stat -c%s "$OUT/01-combo-ad-1080x1920.mp4")"
# 15 s cut: hook + price, the pair, the wish, the ask
$FF -y -hide_banner -loglevel error -i "$OUT/00-combo-ad-4k.mp4" -filter_complex \
"[0:v]select='between(t,0,7.6)+between(t,19.9,23.4)+between(t,28.4,31.9)+between(t,34.0,38.6)',setpts=N/30/TB[v];[0:a]aselect='between(t,0,7.6)+between(t,19.9,23.4)+between(t,28.4,31.9)+between(t,34.0,38.6)',asetpts=N/30/TB[a]" \
   -map "[v]" -map "[a]" -threads 2 -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
   -profile:v high -level 5.1 -movflags +faststart -c:a aac -b:a 160k "$OUT/.t15.mp4" || exit 1
mv -f "$OUT/.t15.mp4" "$OUT/02-combo-ad-15s.mp4"
echo "ok 15s $(stat -c%s "$OUT/02-combo-ad-15s.mp4")"
echo all-done
