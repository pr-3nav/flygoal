# API Contracts & Backend Implementation Plan

## Mock Data Integration Points

### Current Mock Data (frontend/src/data/mock.js)
- `mockJerseys`: Array of jersey designs with voting data
- `mockStats`: Community statistics 
- `mockNavLinks`: Navigation menu items
- `mockHeroContent`: Hero section content
- `mockFeatures`: Feature descriptions

## API Endpoints to Implement

### 1. Jersey Design Management
```
GET /api/jerseys - Get all jersey designs (sorted by votes/date)
POST /api/jerseys - Submit new jersey design
PUT /api/jerseys/:id/vote - Vote/unvote for a design
GET /api/jerseys/:id - Get specific jersey design
```

### 2. Statistics
```
GET /api/stats - Get community statistics (total designs, votes, etc.)
```

### 3. File Upload
```
POST /api/upload - Handle jersey design image uploads
```

## Database Models

### Jersey Design Model
```
{
  id: ObjectId,
  title: String (required),
  description: String,
  designer: String (required),
  imageUrl: String (required),
  votes: Number (default: 0),
  voterIds: [String], // Track who voted to prevent duplicate votes
  submittedAt: Date (default: now),
  isActive: Boolean (default: true)
}
```

### Vote Tracking (Session-based for now)
- Use browser localStorage to track voted jerseys
- Later can implement user authentication

## Frontend Integration Changes

### Replace Mock Data Calls:
1. **VotingSection.jsx**: Replace `mockJerseys` with API call to `/api/jerseys`
2. **GallerySection.jsx**: Replace `mockJerseys` with API call to `/api/jerseys`
3. **AboutSection.jsx**: Replace `mockStats` with API call to `/api/stats`
4. **SubmissionSection.jsx**: 
   - Replace mock submission with POST to `/api/jerseys`
   - Add file upload to `/api/upload`

### API Integration Points:
- Add axios calls to replace mock data
- Implement proper error handling
- Add loading states for better UX
- Handle image upload with proper validation

## File Upload Strategy
- Store uploaded images in `/app/backend/uploads/` directory
- Serve images via static file endpoint
- Implement image validation (type, size)
- Generate unique filenames to prevent conflicts

## Error Handling
- Validation errors for form submissions
- File upload errors (size, type, etc.)
- Network error handling in frontend
- Proper HTTP status codes

## Implementation Order
1. Create MongoDB models
2. Implement jersey CRUD endpoints
3. Add file upload functionality
4. Create statistics endpoint
5. Update frontend to use real APIs
6. Test all functionality

This contract ensures seamless transition from mock data to real backend functionality while maintaining all current features.