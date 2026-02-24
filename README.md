Gator - CLI RSS Aggregator
Gator is a command-line RSS feed aggregator built with TypeScript, Node.js, and PostgreSQL. It allows multiple users to register, follow their favorite RSS feeds, and run a background worker to collect posts and store them for offline browsing.

Features
User Management: Support for multiple users with a persistent login state.

Feed Management: Add, follow, and unfollow RSS feeds.

Automated Aggregation: A background worker that fetches feeds at a configurable interval.

Post Persistence: Stores articles in a database to prevent duplicates and allow historical browsing.

Middleware System: Robust command handling to ensure user authentication.

Prerequisites
Before running Gator, ensure you have the following installed:

Node.js (v18 or higher)

PostgreSQL (Running locally or accessible via URI)

npm or yarn

Installation
Clone the repository:

Bash
git clone https://github.com/your-username/gator.git
cd gator
Install dependencies:

Bash
npm install
Database Configuration:
Create a .gatorconfig.json file in your home directory (e.g., ~/.gatorconfig.json on Linux/Mac) with your database connection string:

JSON
{
  "db_url": "postgres://username:password@localhost:5432/gator",
  "current_user_name": ""
}
Run Migrations:
Apply the schema to your PostgreSQL database:

Bash
npm run generate
npm run migrate
Usage
User Commands
npm run start register <name> - Create a new user account.

npm run start login <name> - Log in as an existing user.

npm run start users - List all registered users.

Feed Commands
npm run start addfeed <name> <url> - Add a new feed and follow it automatically.

npm run start feeds - List all feeds added to the system.

npm run start follow <url> - Follow an existing feed.

npm run start following - View the feeds you are currently following.

Aggregator & Browsing
npm run start agg <duration> - Start the background worker (e.g., agg 1m or agg 30s).

npm run start browse <limit> - View the latest posts from the feeds you follow (defaults to 2).

Project Structure
/src/db/schema.ts - Drizzle ORM schema definitions (Users, Feeds, Follows, Posts).

/src/commands.ts - Command registry and handler logic.

/src/middleware.ts - Logged-in state validation.

/src/rss.ts - RSS XML fetching and parsing logic.