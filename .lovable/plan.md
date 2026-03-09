

# Profile Avatar Selector

## Overview
Add a profile avatar selector that lets users pick from 4 predefined avatar images. The selected avatar persists in the database and displays across the app.

## What already exists
- `profiles` table with `avatar_url` column (text, nullable)
- RLS policies for profiles (users can SELECT/UPDATE/INSERT their own)
- `AuthContext` provides `user` but not profile data

## Implementation

### 1. Copy avatar images to project
Copy the uploaded image as a reference. Since the user provided a single image with 4 avatars, we need to create 4 separate avatar assets. We'll save the uploaded image and also create individual avatar files at:
- `src/assets/avatars/avatar_1.png`
- `src/assets/avatars/avatar_2.png`
- `src/assets/avatars/avatar_3.png`
- `src/assets/avatars/avatar_4.png`

Since we only have one combined image, we'll copy it 4 times and use it as the source. Alternatively, we can use inline SVG illustrations matching the purple brand theme for each avatar (boy drinking juice, girl with pastries, boy with ice cream, girl with milkshake) -- but since the user uploaded a specific image, we'll embed the full image and use CSS `object-position` to crop each quadrant, OR we ask the user to provide individual files.

**Practical approach**: Copy the single uploaded image to `src/assets/avatars/avatars-sheet.png` and use CSS clipping to show each quadrant. Each "avatar" maps to a quadrant position.

### 2. Create `useProfile` hook (`src/hooks/useProfile.ts`)
- Fetch profile from `profiles` table by `user_id`
- Provide `updateAvatar(avatarId: string)` function
- Cache with React Query (`queryKey: ["profile", userId]`)
- Return `{ profile, isLoading, updateAvatar }`

### 3. Create `AvatarSelector` component (`src/components/profile/AvatarSelector.tsx`)
- Display current avatar (96x96, circular)
- 2x2 grid of avatar options with 16px gap
- Selected avatar: 3px border in brand purple, 150ms transition
- Save button (disabled until selection differs from current)
- On save: call `updateAvatar`, show toast

### 4. Update `ProfileView.tsx`
- Add "avatar" as a new `ProfileTab`
- Add avatar menu item to navigate to selector
- Replace the static `<User>` icon in the header with the user's saved avatar
- Add tap handler on the header avatar to open the selector

### 5. Update `AuthContext.tsx`
- Add `avatarId` to context so it's globally available
- Fetch from `profiles` table on auth state change
- Expose `avatarId` and `setAvatarId` in context
- Default to `"avatar_1"` when no avatar is set

### 6. Create `UserAvatar` component (`src/components/shared/UserAvatar.tsx`)
- Reusable component that renders the correct avatar based on `avatarId`
- Uses the sprite sheet with CSS clipping
- Accepts `size` prop
- Fallback to avatar_1 on error

### 7. Update all user-facing UI
- `ProfileView.tsx` header -- use `UserAvatar`
- `OrderHistory` -- if user avatar is shown
- `ProductReviews` -- if user avatar is shown

### File changes summary
| File | Action |
|------|--------|
| `src/assets/avatars/avatars-sheet.png` | Copy uploaded image |
| `src/hooks/useProfile.ts` | Create -- profile data hook |
| `src/components/profile/AvatarSelector.tsx` | Create -- avatar picker UI |
| `src/components/shared/UserAvatar.tsx` | Create -- reusable avatar |
| `src/context/AuthContext.tsx` | Update -- add avatarId |
| `src/components/profile/ProfileView.tsx` | Update -- integrate selector |

No database migration needed -- `avatar_url` column already exists on `profiles`.

