#!/bin/bash

set -e

INPUT_DIR=$1
OUTPUT_DIR=$2

if ! hash convert
then
  echo "You need ImageMagick installed to run this script.  Try \"sudo yum install ImageMagick\"."
  return 1
fi

process_image() {
  local width=$1
  local input="$2"
  local output="$3"

  echo -n ${output}...

  if [[ -f $output ]]
  then
    echo exists.
    return
  fi

  convert "$input" -quality 70 -resize $width -gravity center -crop x300+0+0 "$output" && echo created.
}

for img in $INPUT_DIR/*
do
  filename="$(basename "$img")"
  name="${filename%%.*}"
  ext=${img##*.}
  # process_image 400 $img $OUTPUT_DIR/$name.small.$ext
  # process_image 600 $img $OUTPUT_DIR/$name.medium.$ext
  # process_image 1200 $img $OUTPUT_DIR/$name.large.$ext
  process_image 800x300^ "$img" "$OUTPUT_DIR/$name.responsive.$ext"
  process_image 1500x200^ "$img" "$OUTPUT_DIR/$name.banner.$ext"
done
