# Gemini AI Integration Setup

## Overview

The interview question generation now uses Google's Gemini AI to create intelligent, contextual questions based on the user's specific requirements.

## Setup Instructions

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the generated API key

### 2. Environment Configuration

Add the following to your `.env.local` file:

```bash
# Gemini AI API Key
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Features

#### Intelligent Question Generation

- **Context-Aware**: Questions are tailored to the specific role, level, and tech stack
- **Level-Appropriate**: Different question complexity for Entry, Mid, and Senior levels
- **Type-Specific**: Questions match the interview type (Technical, Behavioral, Situational, Mixed)
- **Tech-Stack Focused**: Questions incorporate specific technologies when provided

#### Fallback System

- If Gemini API is unavailable, the system falls back to pre-defined questions
- If API key is missing, static questions are used
- Graceful error handling ensures the system always works

#### Question Quality

- **Real-world scenarios**: Questions based on actual industry practices
- **Actionable**: Clear, specific questions that elicit detailed responses
- **Role-specific**: Tailored to the exact position being interviewed for
- **Technology-focused**: Incorporates specific tech stack when provided

## API Usage

The system automatically uses Gemini AI when:

- `GEMINI_API_KEY` environment variable is set
- API call is successful
- Generated questions meet quality standards

## Example Generated Questions

For a **Senior Frontend Developer** position with **React, TypeScript**:

1. "Describe a complex state management challenge you solved using React hooks and how you optimized performance."
2. "How do you approach architecting a scalable frontend application with TypeScript and what patterns do you implement?"
3. "Tell me about a time when you had to refactor legacy JavaScript code to TypeScript and the strategies you used."
4. "What's your approach to implementing responsive design with modern CSS frameworks in React applications?"
5. "How do you ensure code quality and maintainability in large React codebases with multiple developers?"

## Troubleshooting

### Common Issues

1. **API Key Not Working**: Verify the key is correct and has proper permissions
2. **Rate Limiting**: Gemini has usage limits; check your quota
3. **Network Issues**: Ensure your server can reach Google's API endpoints

### Fallback Behavior

If Gemini fails, the system will:

1. Log the error for debugging
2. Use pre-defined questions based on role/type/level
3. Continue functioning normally
4. Return a `fallback: true` flag in the response

## Cost Considerations

- Gemini API has usage-based pricing
- Consider implementing caching for frequently requested combinations
- Monitor usage through Google Cloud Console


