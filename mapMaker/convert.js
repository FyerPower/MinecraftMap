const sharp = require('sharp');

sharp('journeyMap.png')
  .limitInputPixels(false)
  .png()
  .tile({
    size: 256,
    layout: 'google'
  })
  .toFile('output', function(err, info) {
      if(err){
          console.log('Error: ' , err);
      } else {
          console.log('Success!');
      }
  });
