 

//tabs
const d = document,
  tabs = d.querySelector('.tabs'),
  tab = d.querySelectorAll('li'),
  contents = d.querySelectorAll('.content');
tabs.addEventListener('click', function (e) {
  if (e.target && e.target.nodeName === 'LI') {
    // change tabs
    for (var i = 0; i < tab.length; i++) {
      tab[i].classList.remove('active');
    }
    e.target.classList.toggle('active');
    // change content
    for (i = 0; i < contents.length; i++) {
      contents[i].classList.remove('active');
    }
    var tabId = '#' + e.target.dataset.tabId;
    d.querySelector(tabId).classList.toggle('active');
  }
});


// get parent element
const sectionCenter = document.querySelector(".section-center");
const buttonContainer = document.querySelector(".btn-container");
const myGallery = document.querySelector(".myGallery");
const saveItem = document.querySelector(".save-btn");
// Variables
const galleryAPI = 'https://collectionapi.metmuseum.org/public/collection/v1/objects';
let personalGalleryArr = [];  
let promiseArray = [];
let galleryArr = [];

// display all items when page loads
window.addEventListener("DOMContentLoaded", function () {
  fetchGalleryDetails();
});


function fetchGalleryDetails() {
  const getGalleryObjs = fetch(galleryAPI);
  getGalleryObjs
    .then(data => data.json())
    .then(data => {
      getAllElements(data).then(() => {
        Promise.all(promiseArray).then(() => {
          promiseArray.forEach((item) => {
            item
              .then(data => data.json())
              .then(data => {
                galleryArr.push(data);
                loadGallery();
              })
          });
        });
      }
      );
    }).catch((error) => {
      console.error('Error:', error);
    });
}

function loadGallery() {
  this.hideLoader();
  this.displayGallery(galleryArr, sectionCenter, true);
  this.bindEvents();
}


async function getAllElements(data) {
  //limiting the details to 25 records
  const galleryDetailIds = data.objectIDs.slice(0, 25);
  for (let i = 1; i < galleryDetailIds.length; i++) {
    promiseArray.push(fetch(galleryAPI+'/'+ i));
  }
  return promiseArray;
}

 
function displayGallery(array, className, btn){
  let displayGalleryGal = array.map(function (item) {
    return `<article class="menu-item">
          <img src="${item.primaryImage}" alt="${item.title}" data-galleryid="${item.objectID}" class="photo" onerror="this.src='./images/fleet.jpg'"/>
          <div class="item-info">
            <header>
              <h4>${item.title}</h4>
            </header>
            <p class="item-text">
              ${item.creditLine}
            </p>
          </div>
        </article>`;
  });

  displayGalleryGal = displayGalleryGal.join("");
  className.innerHTML = displayGalleryGal;
  if(btn){
    buttonContainer.style.display = 'flex';
  }
}


function bindEvents() {
  const photos = sectionCenter.querySelectorAll(".photo");
  document.querySelector(".save-btn").disabled = true;
  photos.forEach(function (photo) {
    photo.addEventListener("click", function (e) {
      moveToPersonalGallery(e.target);
    });
  });
  saveItem.addEventListener("click", function (e) {
    displayGallery(personalGalleryArr, myGallery, false);
    //trigger click to navigate to personal gallery
    document.getElementById('pGallery').click();
  });
}

function moveToPersonalGallery(selectedEle){
  selectedEle.classList.toggle('added');
  let galleryId = selectedEle.dataset.galleryid;
  myArray = [...galleryArr].filter((obj) => {
    return obj.objectID == galleryId;
  });
  let el = personalGalleryArr.filter((obj) => {
    return obj.objectID == galleryId;
  });
  if (el.length) {
    personalGalleryArr = personalGalleryArr.filter((obj) => {
      return obj.objectID != el[0].objectID;
    })
  } else {
    personalGalleryArr.push(myArray[0]);
  }
  if (personalGalleryArr.length === 5) {
    document.querySelector(".save-btn").disabled = false;
  }else{
    document.querySelector(".save-btn").disabled = true;
  }
  
}




function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}