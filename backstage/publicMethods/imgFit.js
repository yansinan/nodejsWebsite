

      

module.exports = {
    imgFit(img,width,height,fit="cover"){
        return new Promise((resolve,reject)=>{
          let resSrc=""

          let canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          canvas.width = width;
          canvas.height = height;
          // get the scale
          var scale = 1;
          if(fit=="cover")scale=Math.max(canvas.width / img.width, canvas.height / img.height);
          if(fit=="fill")scale=Math.min(canvas.width / img.width, canvas.height / img.height);
          // get the top left position of the image
          var x = (canvas.width / 2) - (img.width / 2) * scale;
          var y = (canvas.height / 2) - (img.height / 2) * scale;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          // 输出0.95的是最接近原图的压缩比，//98 到 99 尤其是 99 到 100，增长突然变陡，比原图大小翻了将近 3 倍
          // resSrc = canvas.toDataURL('image/jpeg', 0.95);
          canvas.toBlob(blob=>{
              resSrc=URL.createObjectURL(blob);
              resolve({src:resSrc,blob:blob});
          },img.type || 'image/jpeg');          
        })
    }
}