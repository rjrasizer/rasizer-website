function updateLocationOptions(){
    const modality = document.getElementById("event_modality").value;
    const eventLocation = document.getElementById("location");
    const remoteUrl = document.getElementById("remote_url");
    const attendees = document.getElementById("attendees");

    eventLocation.style.display = "none";
    remoteUrl.style.display = "none";
    attendees.style.display = "none";

    if(modality === "in_person"){
        eventLocation.style.display = "block";
        attendees.style.display = "block";
    }
    else if(modality === "remote"){
        remoteUrl.style.display = "block";
        attendees.style.display = "block";
    }
}

const events = [];

function saveEvent(){
    const name = document.getElementById("event_name").value;
    const weekday = document.getElementById("event_weekday").value;
    const time = document.getElementById("event_time").value;
    const modality = document.getElementById("event_modality").value;
    const category = document.getElementById("event_category").value;
    let location = null;
    let remote_url = null;

    if(modality === "in_person"){
        location = document.getElementById("event_location").value;
    }
    else if(modality === "remote"){
        remote_url = document.getElementById("event_remote_url").value;
    }

    const attendees = document.getElementById("event_attendees").value;

    const eventDetails = {
        name: name,
        category: category,
        weekday: weekday,
        time: time,
        modality: modality,
        location: location, 
        remote_url: remote_url,
        attendees: attendees
    };

    events.push(eventDetails);

    console.log(events);

    addEventToCalendarUI(eventDetails);

    const modalElement = document.getElementById("event_modal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    // updateLocationOptions('');
}

function resetEventModal(){
    const form = document.getElementById('data-form');
    form.reset();
    
    document.getElementById("event_modality").value = "";
    document.getElementById("event_category").value = "";
    document.getElementById("event_weekday").value = "";

    updateLocationOptions();
}

function createEventCard(eventDetails, index){
    let event_element = document.createElement('div');
    event_element.classList = 'event row border rounded m-1 py-1';
    event_element.style.backgroundColor = getColor(eventDetails.category);

    let info = document.createElement('div');
    info.innerHTML = `
        <strong>${eventDetails.name}</strong><br> 
        Category: ${eventDetails.category}<br>
        Time: ${eventDetails.time}<br> 
        ${eventDetails.modality === 'in_person' ? 'Location: ' + eventDetails.location + '<br>' : ''} 
        ${eventDetails.modality === 'remote' ? 'Meeting URL: ' + eventDetails.remote_url + '<br>' : ''} 
        Attendees: ${eventDetails.attendees}
    `;

    event_element.onclick = function(){
        editModal(index);
    };

    event_element.appendChild(info);
    return event_element;
}

function addEventToCalendarUI(eventInfo){
    let index = events.length - 1;
    let event_card = createEventCard(eventInfo, index);

    let dayDiv = document.getElementById(eventInfo.weekday.toLowerCase());

    dayDiv.appendChild(event_card);
}

function getColor(category){
    const colors = {
        "Homework": "#4169e1ff",
        "Work": "#c5c522ff",
        "Sports": "#c6184cff",
        "Test": "#17893fff",
        "Reading": "#1e8192ff",
        "Meeting": "#c98208ff",
        "Miscellaneous": "#e3a5caff",
    };
    return colors[category] || "#ffffff"
}

function editModal(index){
    const event = events[index];

    document.getElementById("event_name").value = event.name;
    document.getElementById("event_category").value = event.category;
    document.getElementById("event_weekday").value = event.weekday;
    document.getElementById("event_time").value = event.time;
    document.getElementById("event_modality").value = event.modality;

    updateLocationOptions();

    if(event.modality === "in_person"){
        document.getElementById("event_location").value = event.location || "";
    }
    else if(event.modality === "remote"){
        document.getElementById("event_remote_url").value = event.remote_url || "";
    }

    document.getElementById("event_attendees").value = event.attendees;

    const modalElement = document.getElementById("event_modal");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    const saveBtn = modalElement.querySelector(".btn-primary");
    saveBtn.onclick = function(){
        updateEvent(index); 
    };
}

function updateEvent(index){
    const event = events[index];

    event.name = document.getElementById("event_name").value;
    event.category = document.getElementById("event_category").value;
    event.weekday = document.getElementById("event_weekday").value;
    event.time = document.getElementById("event_time").value;
    event.modality = document.getElementById("event_modality").value;

    if(event.modality === "in_person"){
        event.location = document.getElementById("event_location").value;
        event.remote_url = null;
    }
    else if(event.modality === "remote"){
        event.remote_url = document.getElementById("event_remote_url").value;
        event.location = null;
    }

    event.attendees = document.getElementById("event_attendees").value;

    const modalElement = document.getElementById("event_modal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    refreshCalendarUI();
}

function refreshCalendarUI(){
    document.querySelectorAll(".event").forEach(el => el.remove());

    events.forEach((eventDetails, index) => {
        addEventToCalendarUI(eventDetails, index);
    });
}