
const images = require('images');
const path = require('path');

const writeFile = require('./writeFile');

class BuildImage{
    constructor(files, param) {

        this.param = Object.assign({
            iconWidth: 40,
            iconHeight: 40,
            savePath: 'icons.png'

        }, param);
        images.setLimit(100000, 100000);
        this._initBuildImage(files);
    }

    _filterImgFiles(files) {
        let filesLen = files.length;
        if (filesLen <= 0) {
            console.log('files is null');
            return false;
        }
        let imgFiles = [];
        files.map(path => {
            if (this._isImage(path)) {
                imgFiles.push(path);
            }
        });
        return imgFiles;
    }
    
    _initBuildImage(files) {
        let imgFile = this._filterImgFiles(files);
        if (!imgFile) {
            return;
        }
        let filesLen = imgFile.length;
        let param = this.param;
        let size = this._getIconsImageSize(imgFile);

        let iconsWidth = param.iconWidth * size;
        let iconsHeight = param.iconHeight * size;

        let imgObj = images.setLimit(iconsWidth, iconsHeight).Image(iconsWidth, iconsHeight).fill(0xff, 0x00, 0x00, 0);

        let iconMap = [];

        for(let i = 0; i < filesLen; i++) {
            let x = i % size * param.iconWidth;
            let y = parseInt(i / size ) * param.iconHeight;
            if (!this._isImage(imgFile[i])) {
                continue;
            }
            let tempImage = images(imgFile[i]);
            let imgPosSize = this._getImgPosSize(tempImage);
            tempImage.size(imgPosSize.width, imgPosSize.height);
            // let temp2Image = images(tempImage, 0, 0, imgPosSize.width, imgPosSize.height);
            console.log(imgPosSize)
            imgObj.draw(tempImage, x + imgPosSize.px, y + imgPosSize.py);
            let basename = path.basename(imgFile[i], path.extname(imgFile[i]));
            iconMap.push({
                px: x,
                py: y,
                iconwidth: param.iconWidth,
                iconheight: param.iconHeight,
                iconname: basename,
                index: i
            });
        }

        this._saveIconsImage(imgObj, 100);
        this._saveIconMap(iconMap);
    }

    _getImgPosSize(tImage) {
        let twidth = tImage.width();
        let theight = tImage.height();
        let {iconWidth, iconHeight} = this.param;
        iconWidth = iconWidth - 8;
        iconHeight = iconHeight - 8;
        let subWidth = twidth, 
        subHeight = theight;

        let tempSub = twidth - theight;
        
        // 宽大于高
        if (tempSub >= 0) {
            if (twidth > iconWidth) {
                let tiP = iconWidth / twidth;

                subWidth = iconWidth;
                subHeight = tiP * theight;
                
            }

        // 高大于宽
        } else {
            if (theight > iconHeight) {
                subHeight = iconHeight;
                subWidth = theight * iconWidth / iconHeight;
            }
        }

        return {
            width: subWidth,
            height: subHeight,
            px: (iconWidth + 8 - subWidth)/2,
            py: (iconHeight + 8 - subHeight)/2
        }

    }



    _getIconsImageSize(files) {
        let fileLength = files.length;
        let size = Math.ceil(Math.sqrt(fileLength));
        return size;
    }

    _isImage(pathstr) {
        let extname = path.extname(pathstr);
        if (/\.(png|jpg|jpeg)/ig.test(extname)) {
            return true;
        } else {
            return false;
        }
    }

    _saveIconsImage(imageObj, quality=100) {
        let finalImageName = this.param.savePath;
        imageObj.save(finalImageName, {
                    quality: quality
                });
    }

    _saveIconMap(mapData) {
        let mapJson = JSON.stringify(mapData);
        let jsonStr = `const icons = ${mapJson};
export default icons;`;
        writeFile('./iconmap.js', jsonStr);
    } 
}

module.exports = BuildImage;