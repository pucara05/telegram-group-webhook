<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# 🤖 Telegram Group Webhook Bot

Bot inteligente para grupos de Telegram construido con **NestJS** e integración con modelos de IA (**Groq** y **Gemini**). Captura mensajes de grupos en tiempo real y responde automáticamente usando IA.

## 🚀 Características

- Recibe mensajes de grupos de Telegram en tiempo real via webhook
- Responde automáticamente usando IA (Groq o Gemini)
- Arquitectura modular con patrón Strategy para proveedores de IA
- Fácil cambio de proveedor de IA desde variables de entorno

## 🛠️ Stack Tecnológico

- **Runtime:** Node.js
- **Framework:** NestJS
- **IA:** Groq (llama-3.1-8b-instant) / Google Gemini
- **Tunnel:** ngrok (desarrollo local)

## 📋 Prerrequisitos

- Node.js >= 18
- Cuenta en [Telegram](https://telegram.org)
- Token de bot de [@BotFather](https://t.me/botfather)
- API Key de [Groq](https://console.groq.com) o [Google AI Studio](https://aistudio.google.com)
- [ngrok](https://ngrok.com) instalado

## ⚙️ Instalación

1. Clona el repositorio
```bash
git clone https://github.com/pucara05/telegram-group-webhook.git
cd telegram-group-webhook
```

2. Instala las dependencias
```bash
npm install
```

3. Configura las variables de entorno
```bash
cp .env.example .env
```

4. Edita el `.env` con tus credenciales

## 🔐 Variables de Entorno
```env
TELEGRAM_BOT_TOKEN=    # Token de @BotFather
NGROK_URL=             # URL de ngrok (desarrollo)
AI_PROVIDER=groq       # groq o gemini
GROQ_API_KEY=          # API Key de Groq
GEMINI_API_KEY=        # API Key de Google AI Studio
PORT=3000
```

## 🚀 Uso en Desarrollo

1. Inicia ngrok
```bash
ngrok http 3000
```

2. Copia la URL y pégala en `NGROK_URL` del `.env`

3. Inicia el servidor
```bash
npm run start:dev
```

4. Agrega el bot al grupo de Telegram como administrador

5. Escribe cualquier mensaje en el grupo y el bot responderá con IA

## 🏗️ Arquitectura
```
src/
├── ai/
│   ├── interfaces/
│   │   └── ai-provider.interface.ts  # Contrato común para proveedores
│   ├── providers/
│   │   ├── gemini.service.ts         # Proveedor Google Gemini
│   │   └── groq.service.ts           # Proveedor Groq
│   ├── ai.module.ts
│   └── ai.service.ts                 # Coordinador de proveedores
└── telegram/
    ├── telegram.controller.ts        # Recibe webhooks de Telegram
    ├── telegram.module.ts
    └── telegram.service.ts           # Lógica de mensajes
```

## 📄 Licencia

MIT

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
