/**
 * Find all img elements with data-pdf-thumbnail-file attribute,
 * then load pdf file given in the attribute,
 * then use pdf.js to draw the first page on a canvas, 
 * then convert it to base64,
 * then set it as the img src.
 */

let uploadImage = (id, imageData) => {
    const formData = new FormData();
    if (imageData) {
        formData.append('image', imageData, `image_${id}.png`);
    } else {
        formData.append('image', '');
    }

    const options = {
      method: 'PATCH',
      body: formData,
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
      }
    };
    
    return fetch(`/api/v1/content/${id}/`, options);
};

var worker = null;
    
var createPDFThumbnail = function(event) {
    event.preventDefault();
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
                canvas.toBlob((blob) => {
                    uploadImage(element.getAttribute('data-id'), blob).then((response) => {
                        window.location.reload();
                    });
                });
            });
        }).catch(function() {
            console.log("pdfThumbnails error: could not open page 1 of document " + filePath + ". Not a pdf ?");
        });
    }).catch(function() {
        console.log("pdfThumbnails error: could not find or open document " + filePath + ". Not a pdf ?");
    });

};


let deletePDFThumbnail = (event) => {
    event.preventDefault();
    
    let element = event.currentTarget;
    let parent = element.closest('td');
    let imageElement = parent.querySelector('img');
    let id = element.getAttribute('data-id');
    
    uploadImage(id, '').then((response) => {
        imageElement.src = '';
        // toggleButtons(parent, false);
        window.location.reload();
    });
};


let toggleButtons = (element, hasImage) => {
    let deleteButton = element.querySelector('button[class="delete-button"]');
    let createButton = element.querySelector('button[class="create-button"]');
    if (hasImage === 'true') {
        createButton.classList.add('hidden');
        deleteButton.classList.remove('hidden');
        deleteButton.addEventListener('click', deletePDFThumbnail);
    } else {
        deleteButton.classList.add('hidden');
        createButton.classList.remove('hidden');
        createButton.addEventListener('click', createPDFThumbnail);
    }
};


document.addEventListener("DOMContentLoaded", function() {
    let nodesArray = Array.prototype.slice.call(document.querySelectorAll('td[class="row"]'));
    for (let i = 0; i < nodesArray.length; i++) {
        let hasImage = nodesArray[i].getAttribute('data-has-image');
        toggleButtons(nodesArray[i], hasImage);
    }
});

