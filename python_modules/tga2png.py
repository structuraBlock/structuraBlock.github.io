import png
import pyTGA
import numpy
import array

def tga2png(tga_file, png_file):
    tga = pyTGA.Image()
    tga.load(tga_file)
    rgbaArray = numpy.array(array.array('B',tga.get_pixels())).reshape([tga._header.image_height , tga._header.image_width * 4])
    rgbaArray = rgbaArray[::-1]
    # print(tga.get_pixels().__len__(),tga._header.image_height,tga._header.image_width)

    # print(rgbaArray)


    result = png.from_array(
        rgbaArray,
        'RGBA',
    )


    result.save(png_file)
