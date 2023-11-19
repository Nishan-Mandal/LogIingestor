// let p = fetch("https://script.google.com/macros/s/AKfycbyauTg_YlAz_8vdwg8W8Ebkr3dFyAUt62-pcVNX-PfdpWPKtVWNDFt-BNEIYTjmxjZF/exec?action=getLog")
// p.then((response) => {
//         console.log(response.status)
//         console.log(response.ok)
//         console.log(response.headers)
//         return response.json()
// }).then((value2) => {
//         console.log(value2)
// })


function buildConditionsArray() {
        var conditions = [];

        // Get all elements with the class 'horizontal-container'
        var containers = document.getElementsByClassName('horizontal-container');

        // Iterate through each container
        for (var i = 0; i < containers.length; i++) {
                var container = containers[i];

                // Check if the checkbox in the container is checked
                var checkbox = container.querySelector('input[type="checkbox"]');
                if (checkbox.checked) {
                // If checked, build the condition object
                var label = container.querySelector('label');
                var column = label.getAttribute('for');
                var operator = container.querySelector('select').value;
                var value = container.querySelector('input[type="text"]').value;

                conditions.push({ columnIndex: column, operator: operator, value: value });
                }
        }

        // Log the resulting array
        console.log(conditions);
        queryData();
        mainFunc()
}

function queryData(){
        var conditions = [
                { columnIndex: 0, operator: '==', value: 'error6' }
              ];
//       var apiUrl = 'https://script.google.com/macros/s/AKfycbx_amXsaAFxBugcmqBGPa6WaJgXlLxNJun_mHuDpH5YW8DddDi3GuzyW3IY7E6gcbAR/exec?action=getLog';
//         // Make the API call
//       fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(conditions),
//       })
//         .then(response => response.json())
//         .then(data => {
//           // Handle the response data here
//           console.log('API Response:', data);
//         })
//         .catch(error => {
//           // Handle errors
//           console.error('API Error:', error);
//         });

}

const createTodo = async (todo) => {
        let options = {
                method: "POST",
                headers: {
                        "Content-type": "application/json"
                },
                body: JSON.stringify(todo),
        }
        let p = await fetch('https://script.google.com/macros/s/AKfycbxylaRp6XHQWMxi6Js8JZXlijlezzbQ_RC21gIzhjc6_FmdShR380Ks7Ef2Gqa3edda/exec', options)
        let response = await p.json()
        return response
}

const mainFunc = async () => {
        var conditions = [
                { columnIndex: 0, operator: '==', value: 'error6' }
              ];
        let todor = await createTodo(conditions)
        console.log(todor)
}
