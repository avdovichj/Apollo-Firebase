const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

// create elements and render cafe
function renderCafe(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let location = document.createElement('span');
    let cross = document.createElement('div');

    // populating the name and location properties
    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    location.textContent = doc.data().location;
    cross.textContent = 'x';

    // adds the properties to the list
    li.appendChild(name);
    li.appendChild(location);
    li.appendChild(cross);

    // adds the list to the form
    cafeList.appendChild(li);

    // deleting cafes
    cross.addEventListener('click', (e) => {
        e.stopPropagation();

        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    });
};

// grabs the data from cafes from the firestore database
//db.collection('cafes').get().then((snapshot) => {
//    snapshot.docs.forEach(doc => {
//        renderCafe(doc); // gets the actual data from the firestore database
//    });
//});

// real-time listener
db.collection('cafes').orderBy('location').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderCafe(change.doc);
        } else if (change.type == 'removed') {
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        }
    });
});

// saving data when a user adds a new cafe
form.addEventListener('submit', (e) => {
    // preventing refreshing of the page (default action)
    e.preventDefault();

    // adding the new cafe to the firestore collection 
    db.collection('cafes').add({
        name: form.name.value,
        location: form.location.value
    });

    // clearing the fields after a cafe has been added
    form.name.value = "";
    form.location.value = "";
});