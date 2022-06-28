/**
 * Find all img elements with data-pdf-thumbnail-file attribute,
 * then load pdf file given in the attribute,
 * then use pdf.js to draw the first page on a canvas, 
 * then convert it to base64,
 * then set it as the img src.
 */

var worker = null;
    
var createPDFThumbnail = function(event) {
    let element = event.currentTarget;
    console.log('createPDFThumbnail', element)

    if (null === worker) {
        worker = new pdfjsLib.PDFWorker();
    }

    var filePath = element.getAttribute('data-pdf-thumbnail-file');
    var imgWidth = element.getAttribute('data-pdf-thumbnail-width');
    var imgHeight = element.getAttribute('data-pdf-thumbnail-height');

    pdfjsLib.getDocument({url: filePath, worker: worker}).promise.then(function (pdf) {
        pdf.getPage(1).then(function (page) {
            var canvas = document.createElement("canvas");
            var viewport = page.getViewport({scale: 1.0});
            var context = canvas.getContext('2d');

            if (imgWidth) {
                viewport = page.getViewport({scale: imgWidth / viewport.width});
            } else if (imgHeight) {
                viewport = page.getViewport({scale: imgHeight / viewport.height});
            }

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            page.render({
                canvasContext: context,
                viewport: viewport
            }).promise.then(function () {
                let parent = element.closest('td');
                let imageElement = parent.querySelector('img');
                imageElement.src = canvas.toDataURL();
                element.remove();
            });
        }).catch(function() {
            console.log("pdfThumbnails error: could not open page 1 of document " + filePath + ". Not a pdf ?");
        });
    }).catch(function() {
        console.log("pdfThumbnails error: could not find or open document " + filePath + ". Not a pdf ?");
    });

};


document.addEventListener("DOMContentLoaded", function() {
    var nodesArray = Array.prototype.slice.call(document.querySelectorAll('button[data-pdf-thumbnail-file]'));
    for (let i = 0; i < nodesArray.length; i++) {
        nodesArray[i].addEventListener('click', createPDFThumbnail);
    }
});

