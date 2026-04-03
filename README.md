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

Bot inteligente para grupos de Telegram construido con **NestJS** e integración con modelos de IA (Groq y Gemini).
Captura mensajes en tiempo real vía webhook y responde automáticamente con IA, manteniendo **memoria persistente con Redis**.

---

## 🚀 Características

* Recibe mensajes de grupos de Telegram en tiempo real vía webhook
* Responde automáticamente usando IA (Groq o Gemini)
* 🧠 Memoria persistente por chat usando Redis
* 🔧 Sistema de tools (clima, hora, etc.)
* Arquitectura modular con patrón Strategy para proveedores de IA
* Fácil cambio de proveedor de IA desde variables de entorno

---

## 🛠️ Stack Tecnológico

* Runtime: Node.js
* Framework: NestJS
* IA: Groq / Google Gemini
* Base de datos: Redis (memoria de conversación)
* Tunnel: ngrok (desarrollo local)
* Contenedores: Docker

---

## 📋 Prerrequisitos

* Node.js >= 18
* Cuenta en Telegram
* Token de bot de @BotFather
* API Key de Groq o Google AI Studio
* Docker (para Redis)
* ngrok instalado

---

## ⚙️ Instalación

### 1. Clonar repositorio

```bash
git clone https://github.com/pucara05/telegram-group-webhook.git
cd telegram-group-webhook
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env`:

```env
TELEGRAM_BOT_TOKEN=
GROQ_API_KEY=
GEMINI_API_KEY=
AI_PROVIDER=groq

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=1

PORT=3000
```

---

## 🧠 Ejecutar Redis

```bash
docker-compose up -d
```

---

## 🚀 Uso en desarrollo

### 1. Iniciar ngrok

```bash
ngrok http 3000
```

### 2. Configurar webhook

```bash
curl -X POST "https://api.telegram.org/bot<TU_TOKEN>/setWebhook" \
-d "url=https://TU_NGROK_URL/telegram/webhook"
```

### 3. Iniciar servidor

```bash
npm run start:dev
```

### 4. Usar el bot

* Agrega el bot al grupo como administrador
* Desactiva privacy mode en BotFather
* Envía mensajes en el grupo

---

## 🔄 Flujo del sistema

1. Telegram envía mensaje al webhook
2. NestJS recibe el mensaje
3. AI analiza intención
4. Si necesita tool → se ejecuta
5. Se guarda historial en Redis
6. Se responde al usuario

---

## 🧱 Arquitectura

```
src/
├── ai/
│   ├── providers/
│   ├── ai.service.ts
│   └── ai.module.ts
├── telegram/
│   ├── telegram.controller.ts
│   └── telegram.service.ts
├── tools/
├── common/
│   └── redis/
```

---

## 🛠️ Tools disponibles

* get_weather
* get_datetime

---

## 🧠 Memoria con Redis

El bot utiliza Redis para almacenar el historial de conversación por chat, permitiendo mantener contexto entre mensajes incluso después de reiniciar el servidor.

---

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
