document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chat-container');
    const chatInput = document.getElementById('chat-input');
    const chatButton = document.getElementById('chat-button');
  
    chatButton.addEventListener('click', function() {
      const userMessage = chatInput.value;
      if (userMessage.trim() === '') return;
  
      // Mostrar el mensaje del usuario
      const userMessageElement = document.createElement('div');
      userMessageElement.className = 'user-message';
      userMessageElement.textContent = userMessage;
      chatContainer.appendChild(userMessageElement);
  
      // Llamar a la API de Gemini
      fetch('https://api.gemini.com/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY' // Reemplaza con tu clave API
        },
        body: JSON.stringify({ message: userMessage })
      })
      .then(response => response.json())
      .then(data => {
        // Mostrar la respuesta del chatbot
        const botMessageElement = document.createElement('div');
        botMessageElement.className = 'bot-message';
        botMessageElement.textContent = data.response;
        chatContainer.appendChild(botMessageElement);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  
      // Limpiar el campo de entrada
      chatInput.value = '';
    });
  });