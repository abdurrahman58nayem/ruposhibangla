#!/usr/bin/env bash
# 3.9 GB of RAM here: a single-pass 4K x264 of 1212 frames gets OOM-killed
# around frame 400. Encode in four segments and concat without re-encoding.
set -u
cd "$(dirname "$0")/../render_ad" || exit 1
FF=$(/home/user/venv/bin/python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
OUT=../deliver23_ad
SEG=/tmp/seg
rm -rf $SEG; mkdir -p $SEG
N=1212; STEP=220
i=0; s=0
: > $SEG/list.txt
while [ $s -lt $N ]; do
  printf -v name "%02d" $i
  $FF -y -hide_banner -loglevel error -framerate 30 -start_number $s \
      -i frames/%05d.jpg -frames:v $STEP -threads 1 \
      -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -profile:v high \
      -level 5.1 -x264-params threads=1:lookahead-threads=1 \
      "$SEG/p$name.mp4" || exit 1
  echo "file 'p$name.mp4'" >> $SEG/list.txt
  echo "seg $name frames $s+$STEP"
  s=$((s+STEP)); i=$((i+1))
done
$FF -y -hide_banner -loglevel error -f concat -safe 0 -i $SEG/list.txt \
    -i mix.wav -c:v copy -c:a aac -b:a 192k -movflags +faststart -shortest \
    "${OUT}/.tmp_00.mp4" || exit 1
mv -f "${OUT}/.tmp_00.mp4" "${OUT}/00-combo-ad-4k.mp4"
echo "ok 4k $(stat -c%s "${OUT}/00-combo-ad-4k.mp4")"
