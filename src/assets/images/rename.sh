WORKING_DIR='./sources'
OUTPUT_DIR_FULL='./products'
OUTPUT_DIR_SMALL='./products-small'

rm $OUTPUT_DIR_FULL/*
rm $OUTPUT_DIR_SMALL/*

for f in $WORKING_DIR/*.png; do 
	basename="$(basename $f .psd)"
	sku=$(echo $basename | sed 's/_.\+//g')

	imageType=$(echo $basename | sed 's/^[0-9]\+_//g')
	imageType=$(echo $imageType | sed 's/_[lL]ayer-1\+\.png//g')
	imageType=$(echo $imageType | sed 's/_Color-Fill-[0-9].png//g')

	if [ $imageType -eq "0000" ]
	then
		echo "Texture!"
		cp $f $OUTPUT_DIR_FULL/$sku-texture.png
	elif [ $imageType -eq "0002" ]
	then
		echo "Shape!" 
		cp $f $OUTPUT_DIR_FULL/$sku-shape.png
	fi
done

cp -r $OUTPUT_DIR_FULL/* $OUTPUT_DIR_SMALL

mogrify -resize 500x500 $OUTPUT_DIR_SMALL/*.png