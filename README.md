# Echo Video Burst - AI-Powered Video Summaries

## Project Overview

Echo Video Burst is an AI-powered application that automatically analyzes videos and generates comprehensive summaries with timestamps and section breakdowns. Users can upload videos, get instant AI-generated summaries, and share their analyzed content with others.

## Features

- 🎥 **Video Upload & Analysis**: Upload videos and get AI-powered summaries
- 📝 **Smart Summaries**: Automatic generation of video summaries with key insights
- ⏱️ **Timestamp Navigation**: Jump to any section with precise timestamps
- 🔗 **Video Sharing**: Share analyzed videos with public links
- 👤 **User Authentication**: Secure sign-up/sign-in with Google OAuth and email(Need completion for production)
- 🔒 **Password Reset**: Complete password reset functionality
- 📊 **Video History**: Track and manage your analyzed videos
- 🎨 **Modern UI**: Beautiful, responsive interface built with shadcn/ui

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- **Frontend**: Vite, TypeScript, React, shadcn/ui, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Security**: Comprehensive security policies and audit logging

## Database Setup

Before running the application, you need to set up the database with proper security configurations:

### Option 1: Using the Setup Script (Recommended)

**For Windows (PowerShell):**
```powershell
.\setup-database.ps1
```

**For macOS/Linux:**
```bash
chmod +x setup-database.sh
./setup-database.sh
```

### Option 2: Manual Setup

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Apply migrations:
```bash
supabase db push
```

3. Configure Supabase Dashboard:
   - Enable password resets in Authentication > Settings
   - Configure email templates for password reset
   - Set Site URL to your domain

### Security Features

The database includes comprehensive security features:

- **Row Level Security (RLS)**: Users can only access their own data
- **Password Reset Security**: Secure token-based password reset with audit logging
- **Rate Limiting**: Protection against brute force attacks
- **Input Sanitization**: Protection against SQL injection and XSS
- **Audit Logging**: Track security events and user activities
- **Suspicious Activity Detection**: Monitor for unusual login patterns
