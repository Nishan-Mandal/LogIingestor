
/**
 * Builds an array of conditions based on user input and calls the queryData function.
 * @throws {MyCustomError} Throws an error if no conditions are selected.
 */
function buildConditionsArray() {
        try {
                var conditions = [];

                // Get all elements with the class 'horizontal-container'
                var containers = document.getElementsByClassName('horizontal-container');

                // Iterate through each container
                for (var i = 0; i < containers.length; i++) {
                        var container = containers[i];

                        // Check if the checkbox in the container is checked
                        var checkbox = container.querySelector('input[type="checkbox"]');
                        if (checkbox && checkbox.checked) {
                                // If checked, build the condition object
                                var label = container.querySelector('label');
                                var column = label.getAttribute('for');
                                var operator = container.querySelector('select').value;
                                // Check if the operator is 'BETWEEN'
                                if (operator === 'BETWEEN') {
                                        // For 'BETWEEN', get both input values
                                        var value1 = container.querySelector('input[type="text"]').value;
                                        var value2 = container.querySelector('input[type="text"]:last-child').value;

                                        // Add both values to the conditions array
                                        conditions.push({ columnIndex: column, operator: operator, value: [value1, value2] });
                                } else {
                                        // For other operators, get the single input value
                                        var value = container.querySelector('input[type="text"]').value;

                                        // Add the value to the conditions array
                                        conditions.push({ columnIndex: column, operator: operator, value: value });
                                }
                        }
                }

                // Check if conditions array is empty
                if (conditions.length === 0) {
                        throw new MyCustomError('Error: No conditions selected! Please select atleast one filter');
                }

                // Clear any previous error message
                document.getElementById('message').innerText = '';

                // Calling queryData function with the conditions
                queryData(conditions);
        } catch (error) {
                document.getElementById('message').innerText = error.message;
        }
}

/**
 * Makes a request to a Google Apps Script API with specified conditions and updates the response table.
 * @param {Array} conditions - An array of conditions for filtering data.
 */
function queryData(conditions) {
        const responseTableElement = document.getElementById('responseTable').innerHTML = '';
        const encodedConditions = encodeURIComponent(JSON.stringify(conditions));
        const apiUrl = `https://script.google.com/macros/s/AKfycbzD_y7qWBu0YAQyrDxuP6QnLXCyc2lb73-G8veVDnA5Wf6S4-wuigoMm6fjKDtXLmAo/exec?conditions=${encodedConditions}`;
        //Make callout
        sendRequest(apiUrl);
}

/**
 * Executes an advanced query with the specified text, updating the response table.
 * Throws an error if the text is empty.
 */
function advancedQuery() {
        try {
                document.getElementById('message').innerText = '';
                document.getElementById('responseTable').innerHTML = '';
                var text = document.getElementById('globalText').value;
                console.log(text);
                if (text == '' || text == null || text == undefined) {
                        throw new MyCustomError('Error: Please enter the value in the text box');
                }
                const apiUrl = `https://script.google.com/macros/s/AKfycbzD_y7qWBu0YAQyrDxuP6QnLXCyc2lb73-G8veVDnA5Wf6S4-wuigoMm6fjKDtXLmAo/exec?text=${text}`;
                sendRequest(apiUrl);
        } catch (error) {
                document.getElementById('message').innerText = error.message;
        }
}

/**
 * Sends a GET request to the specified API URL and handles the response.
 * @param {string} apiUrl - The URL to send the GET request to.
 */
function sendRequest(apiUrl) {
        // Make the GET request
        fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                        // Handle the response data here
                        console.log('API Response:', data);
                        displayResponseTable(data);
                })
                .catch(error => {
                        // Handle errors
                        console.error('API Error:', error);
                });
}


/**
 * Displays the API response data in an HTML table.
 * @param {Object[]} responseData - The array of objects containing API response data.
 */
function displayResponseTable(responseData) {
        // Get the <table> element by its id
        const responseTableElement = document.getElementById('responseTable');

        // Define the desired column names
        const columnNames = [
                'level',
                'message',
                'resourceId',
                'timestamp',
                'traceId',
                'spanId',
                'commit',
                'metadata-parentResourceId'
        ];

        // Create a table header row
        const headerRow = responseTableElement.insertRow(0);
        for (const columnName of columnNames) {
                const headerCell = headerRow.insertCell();
                headerCell.textContent = columnName;
                headerCell.style.fontWeight = 'bold';
        }

        // Create table data rows
        for (const response of responseData) {
                const dataRow = responseTableElement.insertRow();
                for (const key in response) {
                        const dataCell = dataRow.insertCell();
                        dataCell.textContent = response[key];
                }
        }
}


/**
 * Handles the change event of the operator select element and dynamically adjusts
 * the number of text input fields based on the selected operator.
 * @param {HTMLSelectElement} operatorSelect - The HTML select element for operators.
 */
function handleOperatorChange(operatorSelect) {
        var textContainer = document.getElementById('timestampTextContainer');
        var selectedOperator = operatorSelect.value;

        // If the selected operator is 'BETWEEN', show two text fields
        if (selectedOperator === 'BETWEEN') {
                textContainer.innerHTML = `
            <input type="text" id="timestampTextStart" name="timestampTextStart" placeholder="Start">
            <input type="text" id="timestampTextEnd" name="timestampTextEnd" placeholder="End">
          `;
        } else {
                // Otherwise, show a single text field
                textContainer.innerHTML = `
            <input type="text" id="timestampText" name="timestampText" placeholder="Enter text">
          `;
        }
}

/**
 * Custom error class for handling specific error scenarios.
 * @class MyCustomError
 * @extends {Error}
 * @param {string} message - The error message.
 */
class MyCustomError extends Error {
        constructor(message) {
                super(message);
                this.name = 'MyCustomError';
        }
}