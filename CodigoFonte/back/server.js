const app = require('./src/app');
require('dotenv').config();

// Define a porta, usando 5000 como padrão (ou a que estiver no .env)
const PORT = process.env.PORT || 3000; 

// O teste de conexão DB acontece no momento em que a aplicação é iniciada
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
});