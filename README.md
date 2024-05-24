# 🥒 Pickle

Pickle is a fun game where users can generate 9 images based on a prompt. One of these images will be based on AI, and it will be up to the user to figure out which image is "fake".


# Installation

To install Pickle simply clone the reopsitory 

```bash
$ git clone https://github.com/Leg3ndary/pickle.git
```

# Running the Project

To run this project first install the latest version of [Node.js](https://nodejs.org/en/).

Afterwards, install the project and follow the following steps.

Create a file called .env.local and add the following kv pairs:

```env
apikey="YOUR_API_KEY"
WEBHOOK="YOUR_DISCORD_WEBHOOK"
```

The API key is the key for OpenAI's DALLE-3 API. The webhook is the webhook for a discord channel to log data.

Finally run the following commands:

```bash
$ npm install
$ npm run dev
```

# Usage

To use Pickle, simply navigate to the game part of the website and click the "New Board" button. This will generate 9 images based on a prompt. One of these images will be based on AI, and it will be up to the user to figure out which image is "fake".

# Contributing

To contribute to Pickle, simply fork the repository and submit a pull request.
