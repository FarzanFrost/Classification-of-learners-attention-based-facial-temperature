const server_url = 'http://127.0.0.1:8000/'
let fileId_global = null;

// Get the form and submit button by their IDs
const myForm = document.getElementById('myForm');
const submitButton = document.getElementById('submitButton');
const mainDiv = document.getElementById('main');
const cptDiv = document.getElementById('cpt-content')
const countdown_time = 600 // 10 minutes = 600 seconds
const cpt_duration = 298

let experiment_data = {}
let single_alphabet_iteration_data = {}
let cpt_experiment_iteration_count = 0

// Add a click event listener to the submit button
submitButton.addEventListener('click', function() {
    // Check if all required fields have been filled
    if (myForm.checkValidity()) {
        // If all required fields are filled, you can submit the form or perform other actions here
        experiment_data = {}
        single_alphabet_iteration_data = {}
        cpt_experiment_iteration_count = 0
        experiment_data.age = myForm.elements['age'].value
        experiment_data.gender = myForm.elements['gender'].value
        experiment_data.reserach_experience = myForm.elements['anyresearchexperience'].value
        experiment_data.day_started = myForm.elements['daystarted'].value
        experiment_data.mood_affected = myForm.elements['incidentsthataffectyourmood'].value
        experiment_data.hours_slept = myForm.elements['hoursslept'].value
        experiment_data.had_any_food = myForm.elements['hadanyfood'].value
        experiment_data.any_face_injuries = myForm.elements['anyfaceinjuries'].value
        experiment_data.room_temperature = myForm.elements['roomtemperature'].value
        experiment_data.experiment_date = new Date()
        mainDiv.style.display = 'none';
        save_user_details(experiment_data).then(fileId => {
            if(fileId != null){
                fileId_global = fileId;
                countdown(countdown_time);
            }else{
                alert('SERVER ERROR!!!')
            }
        })
        
    } else {
        // If there are validation errors, display an error message or perform other actions here
        alert('Form is invalid. Please fill out all required fields.');
        mainDiv.style.display = 'none';
    }
});

function countdown(durationInSeconds) {
    let secondsRemaining = durationInSeconds;

    const intervalId = setInterval(function() {
        const minutes = Math.floor(secondsRemaining / 60);
        const seconds = secondsRemaining % 60;
        
        time_count = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        
        cptDiv.innerHTML = time_count
        
        if (secondsRemaining <= 0) {
            clearInterval(intervalId);
            // Add the event listener
            document.addEventListener('keydown', spacebarListener);
            
            single_alphabet_iteration_data.cpt_experiment_iteration_count = (++cpt_experiment_iteration_count).valueOf()
            single_alphabet_iteration_data.space_bar_pressed_time = -1
            
            cpt_start_time = new Date().getTime()
            save_cpt_start_time(cpt_start_time)
            single_alphabet_iteration_data.alphabet_display_time = cpt_start_time.valueOf()
            
            current_alphabet = getRandomCapitalAlphabetCharacter(); // Call the function to log a random capital letter
            single_alphabet_iteration_data.current_alphabet = current_alphabet.valueOf()
            cptDiv.innerHTML = current_alphabet
            setTimeout(hideAlphabet, 250)
            logTimeEvery2Seconds(cpt_duration);
        } else {
            secondsRemaining--;
        }
    }, 1000); // 1000 milliseconds (1 second)
}

function hideAlphabet(){
    cptDiv.innerHTML = ''
}

function logTimeEvery2Seconds(durationInSeconds) {
    let secondsElapsed = 0;
    const intervalId = setInterval(function () {
        save_cpt_details(single_alphabet_iteration_data)
        if (secondsElapsed < durationInSeconds) {
            single_alphabet_iteration_data.cpt_experiment_iteration_count = (++cpt_experiment_iteration_count).valueOf()
            single_alphabet_iteration_data.alphabet_display_time = new Date().getTime().valueOf()
            single_alphabet_iteration_data.space_bar_pressed_time = -1

            document.addEventListener('keydown', spacebarListener);
            current_alphabet = getRandomCapitalAlphabetCharacter(); // Call the function to log a random capital letter
            single_alphabet_iteration_data.current_alphabet = current_alphabet.valueOf()
            cptDiv.innerHTML = current_alphabet 
            setTimeout(hideAlphabet, 250)
            secondsElapsed += 2;
        } else {
            clearInterval(intervalId);
            document.removeEventListener('keydown', spacebarListener);
            cptDiv.innerHTML = 'CPT Complete...'
        }
    }, 2000); // 2000 milliseconds (2 seconds)
}


function getRandomCapitalAlphabetCharacter() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomIndex;
    let randomCharacter;

    randomIndex = Math.floor(Math.random() * alphabet.length);
    randomCharacter = alphabet.charAt(randomIndex);
    return randomCharacter;
}

// Define the event listener function
function spacebarListener(event) {
    if (event.keyCode === 32 || event.key === ' ') {
        single_alphabet_iteration_data.space_bar_pressed_time = new Date().getTime().valueOf()
        document.removeEventListener('keydown', spacebarListener);
    }
}


const server_check = async (url, response_message) => {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            alert(response_message)
        }else{
            alert('Success')
            const data = await response.json();
            if(!data.True) alert(response_message);
        }
    } catch (error) {
        alert(response_message)
    }
}


const save_user_details = async (experiment_data) => {
    let fileId = null
    try{
        url = `${server_url}save_user_details`
        const response = await fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(experiment_data)
            }
        );

        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json();
        fileId = data.fileId
    }catch(error){
        alert('Error!!!')
    }

    return fileId
}

const save_cpt_details = async (single_alphabet_iteration_data) => {
    try{
        url = `${server_url}save_cpt_details/${fileId_global}`
        const response = await fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(single_alphabet_iteration_data)
            }
        );

        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
    }catch(error){
        alert('Error!!!')
    }
}

const save_cpt_start_time = async (start_time) => {
    try{
        url = `${server_url}save_cpt_start_time/${fileId_global}`
        data = {}
        data.start_time = start_time
        const response = await fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        );

        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
    }catch(error){
        alert('Error!!!')
    }
}


server_check(server_url, 'SERVER ERROR!!!')