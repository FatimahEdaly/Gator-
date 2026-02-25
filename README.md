# 🐊 Gator - CLI RSS Aggregator

Gator is a command-line RSS feed aggregator built with **TypeScript**, **Node.js**, and **PostgreSQL**. It allows multiple users to register, follow their favorite RSS feeds, and run a background worker to collect posts and store them for offline browsing.
## ✨ Features
* **User Management**: Support for multiple users with a persistent login state.
* **Feed Management**: Add, follow, and unfollow RSS feeds.
* **Automated Aggregation**: A background worker that fetches feeds at a configurable interval.
* **Post Persistence**: Stores articles in a database to prevent duplicates using `ON CONFLICT` logic.
* **Middleware System**: High-order functions to ensure user authentication and DRY code.
## 📋 Prerequisites
Before running Gator, ensure you have the following installed:
* **Node.js** (v18 or higher)
* **PostgreSQL** (Running locally or accessible via URI)
* **npm** or **yarn**
## 🚀 Installation
1. **Clone the repository**:
   ```bash
   git clone [https://github.com/your-username/gator.git](https://github.com/your-username/gator.git)
   cd gator
2. Install dependencies:
    ```Bash
      npm install
      
3. Database Configuration:
Create a .gatorconfig.json file in your home directory (e.g., ~/.gatorconfig.json on Linux/Mac) with your database connection string:
    ```JSON
     {
     "db_url": "postgres://username:password@localhost:5432/gator",
     "current_user_name": ""
     }
     
4. Run Migrations:
    ```Bash
     npm run generate
     npm run migrate
🛠️ Usage
User Commands
   - npm run start register <name> - Create a new user account.
   - npm run start login <name> - Log in as an existing user.
   - npm run start users - List all registered users.
Feed Commands
  - npm run start addfeed <name> <url> - Add a new feed and follow it.
  - npm run start feeds - List all feeds in the system.
  - npm run start follow <url> - Follow an existing feed.
  - npm run start unfollow <url> - Unfollow a feed.
  - npm run start following - View the feeds you follow.
Aggregator & Browsing
 - npm run start agg <duration> - Start the worker (e.g., 1m, 30s, 1h).
 - npm run start browse <limit> - View latest posts (default limit: 2).
📂 Project Structure
  
   - /src/db/schema.ts - Drizzle ORM schema definitions.
   - /src/commands.ts - Command registry and handler logic.
   - /src/middleware.ts - Logged-in state validation logic.
   - /src/rss.ts - RSS XML fetching and parsing logic.s - RSS XML fetching and parsing logic.
