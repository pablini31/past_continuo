// server.js

/**
 * ═══════════════════════════════════════════════════
 * 🚀 SERVER ENTRY POINT
 * ═══════════════════════════════════════════════════
 * 
 * Punto de entrada de la aplicación.
 * Inicializa el servidor Express.
 */

const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

/**
 * Inicia el servidor
 */
async function startServer() {
  try {
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('🎓 PAST CONTINUOUS BUILDER');
    console.log('═══════════════════════════════════════════════════');
    console.log('');

    // TODO: Cuando conectemos las bases de datos, inicializarlas aquí
    // await connectMongoDB();
    // await connectMySQL();

    // Iniciar servidor Express
    const server = app.listen(PORT, () => {
      console.log('✅ Servidor iniciado exitosamente');
      console.log('');
      console.log(`🌐 URL Local:      http://localhost:${PORT}`);
      console.log(`📝 Modo:           ${process.env.NODE_ENV}`);
      console.log(`🏥 Health Check:   http://localhost:${PORT}/api/health`);
      console.log(`📡 API Info:       http://localhost:${PORT}/api`);
      console.log('');
      console.log('💡 Presiona Ctrl+C para detener el servidor');
      console.log('═══════════════════════════════════════════════════');
      console.log('');
    });

    // ═══════════════════════════════════════════════
    // 🛑 GRACEFUL SHUTDOWN
    // ═══════════════════════════════════════════════
    
    /**
     * Manejo de cierre graceful del servidor
     * Cierra conexiones correctamente antes de apagar
     */
    const gracefulShutdown = async (signal) => {
      console.log('');
      console.log(`⚠️  Señal ${signal} recibida. Cerrando servidor...`);
      
      server.close(async () => {
        console.log('🛑 Servidor HTTP cerrado');
        
        // TODO: Cerrar conexiones a bases de datos
        // await closeMongoDB();
        // await closeMySQL();
        
        console.log('👋 Servidor completamente cerrado');
        console.log('');
        process.exit(0);
      });

      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        console.error('⏱️  Tiempo de espera excedido. Forzando cierre...');
        process.exit(1);
      }, 10000);
    };

    // Escuchar señales de terminación
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT')); // Ctrl+C

    // Capturar errores no manejados
    process.on('unhandledRejection', (err) => {
      console.error('❌ UNHANDLED REJECTION! Apagando...');
      console.error(err);
      gracefulShutdown('UNHANDLED_REJECTION');
    });

    process.on('uncaughtException', (err) => {
      console.error('❌ UNCAUGHT EXCEPTION! Apagando...');
      console.error(err);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

  } catch (err) {
    console.error('');
    console.error('═══════════════════════════════════════════════════');
    console.error('💥 ERROR FATAL AL INICIAR SERVIDOR');
    console.error('═══════════════════════════════════════════════════');
    console.error(err);
    console.error('');
    process.exit(1);
  }
}

// 🏁 Iniciar la aplicación
startServer();