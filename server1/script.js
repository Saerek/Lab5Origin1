// This code was assisted by ChatGPT

class ClientApp {
    constructor(apiUrl) {
      this.apiUrl = apiUrl;
      this.insertButton = document.getElementById('insertButton');
      this.submitQueryButton = document.getElementById('submitQuery');
      this.responseArea = document.getElementById('response');
      this.sqlQueryInput = document.getElementById('sqlQuery');
  
      this.samplePatients = [
        { name: 'Sara Brown', dob: '1901-01-01' },
        { name: 'John Smith', dob: '1941-01-01' },
        { name: 'Jack Ma', dob: '1961-01-30' },
        { name: 'Elon Musk', dob: '1999-01-01' }
      ];
  
      this.addEventListeners();
    }
  
    // Add event listeners to buttons
    addEventListeners() {
      this.insertButton.addEventListener('click', () => this.insertSamplePatients());
      this.submitQueryButton.addEventListener('click', () => this.submitQuery());
    }
  
    // Insert sample patients into the database
    async insertSamplePatients() {
      try {
        const insertQueries = this.samplePatients.map(patient => {
          const escapedName = this.escapeString(patient.name);
          const escapedDob = this.escapeString(patient.dob);
          return `INSERT INTO patient (name, dateOfBirth) VALUES ('${escapedName}', '${escapedDob}')`;
        }).join('; ');
  
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain'
          },
          body: insertQueries
        });
  
        const data = await response.json();
        this.displayResponse(data);
      } catch (error) {
        this.displayError(error);
      }
    }
  
    // Handle submission of SQL queries
    async submitQuery() {
      const query = this.sqlQueryInput.value.trim();
  
      if (query.toLowerCase().startsWith('select')) {
        await this.executeSelectQuery(query);
      } else if (query.toLowerCase().startsWith('insert')) {
        await this.executeInsertQuery(query);
      } else {
        this.displayResponse('Only SELECT and INSERT queries are allowed.');
      }
    }
  
    // Execute SELECT queries
    async executeSelectQuery(query) {
      try {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`${this.apiUrl}?q=${encodedQuery}`, {
          method: 'GET'
        });
  
        const data = await response.json();
        this.displayResponse(data);
      } catch (error) {
        this.displayError(error);
      }
    }
  
    // Execute INSERT queries
    async executeInsertQuery(query) {
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain'
          },
          body: query
        });
  
        const data = await response.json();
        this.displayResponse(data);
      } catch (error) {
        this.displayError(error);
      }
    }
  
    // Display the response from the server
    displayResponse(data) {
      this.responseArea.textContent = JSON.stringify(data, null, 2);
    }
  
    // Display errors
    displayError(error) {
      this.responseArea.textContent = `Error: ${error}`;
    }
  
    // Escape single quotes in strings to prevent SQL syntax errors
    escapeString(str) {
      return str.replace(/'/g, "\\'");
    }
  }
  
  // Instantiate the ClientApp when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api/v1/sql';
    new ClientApp(API_URL);
  });
  