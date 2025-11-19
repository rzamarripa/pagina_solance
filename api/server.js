const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar transporter de nodemailer
// Por defecto usa SMTP, pero puedes configurarlo según tu proveedor
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER || 'solanceresidences@gmail.com',
    pass: process.env.SMTP_PASS || '', // Debe configurarse en .env
  },
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

// Ruta para enviar correo
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, lastName, email, phone, country, state } = req.body;

    // Validar campos requeridos
    const errors = [];
    if (!name || name.trim() === '') {
      errors.push('El nombre es requerido');
    }
    if (!lastName || lastName.trim() === '') {
      errors.push('El apellido es requerido');
    }
    if (!email || email.trim() === '') {
      errors.push('El correo electrónico es requerido');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('El correo electrónico no es válido');
    }
    if (!phone || phone.trim() === '') {
      errors.push('El teléfono es requerido');
    }
    if (!country || country.trim() === '') {
      errors.push('El país es requerido');
    }
    if (!state || state.trim() === '') {
      errors.push('El estado es requerido');
    }

    // Si hay errores, retornarlos
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors,
      });
    }

    // Configurar el correo
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'solanceresidences@gmail.com',
      to: process.env.TO_EMAIL || 'solanceresidences@gmail.com',
      replyTo: email,
      subject: 'Nuevo contacto desde Solance Residences',
      text: `Nuevo contacto recibido desde el sitio web de Solance Residences

Información del contacto:
----------------------------------------
Nombre: ${name}
Apellido: ${lastName}
Correo electrónico: ${email}
Teléfono: ${phone}
País: ${country}
Estado: ${state}
----------------------------------------
Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}
`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5f5045;">Nuevo contacto desde Solance Residences</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <h3 style="color: #333; margin-top: 0;">Información del contacto:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #555;">Nombre:</td>
                <td style="padding: 8px; color: #333;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #555;">Apellido:</td>
                <td style="padding: 8px; color: #333;">${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #555;">Correo electrónico:</td>
                <td style="padding: 8px; color: #333;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #555;">Teléfono:</td>
                <td style="padding: 8px; color: #333;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #555;">País:</td>
                <td style="padding: 8px; color: #333;">${country}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #555;">Estado:</td>
                <td style="padding: 8px; color: #333;">${state}</td>
              </tr>
            </table>
            <p style="margin-top: 20px; color: #666; font-size: 12px;">
              Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}
            </p>
          </div>
        </div>
      `,
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Correo enviado exitosamente. Nos pondremos en contacto contigo pronto.',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar el correo. Por favor, intenta nuevamente más tarde.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

